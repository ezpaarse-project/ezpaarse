<template>
  <div class="search-box">
    <input
      @input="query = $event.target.value"
      type="text"
      aria-label="Search"
      autocomplete="off"
      spellcheck="false"
      ref="search"
      placeholder="Search"
      :class="{ 'focused': focused }"
      @focus="focused = true"
      @blur="focused = false"
      @keyup.enter="go(focusIndex)"
      @keyup.up="onUp"
      @keyup.down="onDown"
    >

    <ul
      v-if="showSuggestions"
      class="suggestions"
      :class="{ 'align-right': alignRight }"
      @mouseleave="unfocus"
    >
      <li
        v-for="(suggestion, index) in suggestions"
        :key="index"
        :ref="`suggestion_${suggestion}`"
        class="suggestion"
        :class="{ focused: index === focusIndex }"
        @mousedown="go(index)"
        @mouseenter="focus(index)"
      >
        <a
          :href="suggestion.path"
          @click.prevent
        >
          <span class="page-title">
            <strong class="text--primary">
              {{ suggestion.title }}
            </strong>
            > <span v-html="suggestion.content"></span>
          </span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import Flexsearch from "flexsearch";

export default {
  data () {
    return {
      index: null,
      focused: false,
      focusIndex: 0,
      query: ''
    };
  },
  mounted () {
    document.addEventListener('keydown', this.onHotkey);

    this.index = new Flexsearch({
      tokzenize: 'full',
      encode: 'extra',
      threshold: 1,
      resolution: 3,
      doc: {
        id: 'key',
        field: ['title', 'content']
      }
    });

    const { pages } = this.$site;
    this.index.add(pages);
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.onHotkey);
  },
  computed: {
    suggestions () {
      const query = this.query.trim().toLowerCase();
      if (!query) {
        return;
      }

      return this.index.search(query, 10).map((page) => {
        return this.getPageInfo(page);
      });
    },
    showSuggestions () {
      return  this.focused && this.suggestions && this.suggestions.length;
    },
    alignRight () {
      const navCount = (this.$site.themeConfig.nav || []).length;
      const repo = this.$site.repo ? 1 : 0;
      return navCount + repo <= 2;
    }
  },
  methods: {
    onHotkey (event) {
      if (event.srcElement === document.body && SEARCH_HOTKEYS.includes(event.key)) {
        this.$refs.input.focus();
        event.preventDefault();
      }
    },
    onUp () {
      if (this.showSuggestions) {
        if (this.focusIndex > 0) {
          this.focusIndex--;
        } else {
          this.focusIndex = this.suggestions.length - 1;
        }
      }
    },
    onDown () {
      if (this.showSuggestions) {
        if (this.focusIndex < this.suggestions.length - 1) {
          this.focusIndex++;
        } else {
          this.focusIndex = 0;
        }
      }
    },
    go (index) {
      if (!this.showSuggestions) {
        return
      }
      const path = this.suggestions[index].path;
      if (this.$route.path !== path) {
        this.$router.push(this.suggestions[index].path);
      };
      this.query = '';
      this.focusIndex = 0;
    },
    focus (index) {
      this.focusIndex = index;
    },
    unfocus () {
      this.focusIndex = -1;
    },
    getPageInfo (page) {
      const position = page.content
        .toLowerCase()
        .indexOf(this.query.toLowerCase());

      let content = page.content
        .slice(Math.max(position, 0), Math.max(position, 0) + 30)
        .toLowerCase()
        .replace(/[\W_]+/g, ' ');

      const queryWords = this.query.split(' ').filter((v, i, a) => !!v && a.indexOf(v) === i);
      for (const word of queryWords) {
        const index = content.indexOf(word.toLowerCase());
        if (index >= 0) {
          content = content.replace(new RegExp(word, 'gi'), `<strong class="text--primary">${word}</strong>`);
        }
      }

      return {
        title: page.title,
        path: page.path,
        content
      };
    }
  }
}
</script>

<style lang="stylus">
.search-box {
  display: inline-block;
  position: relative;
  margin-right: 1rem;

  input {
    cursor: text;
    width: 15rem;
    height: 2rem;
    color: lighten($textColor, 25%);
    display: inline-block;
    border: 1px solid darken($borderColor, 10%);
    border-radius: 2rem;
    font-size: 0.9rem;
    line-height: 2rem;
    padding: 0 0.5rem 0 2rem;
    outline: none;
    transition: all 0.2s ease;
    background: #fff url('search.svg') 0.6rem 0.5rem no-repeat;
    background-size: 1rem;

    &:focus {
      cursor: auto;
      border-color: $accentColor;
    }
  }

  .suggestions {
    background: #fff;
    width: 20rem;
    position: absolute;
    top: 1.5rem;
    border: 1px solid darken($borderColor, 10%);
    border-radius: 6px;
    padding: 0.4rem;
    list-style-type: none;

    &.align-right {
      right: 0;
    }
  }

  .suggestion {
    line-height: 1.4;
    padding: 0.4rem 0.6rem;
    border-radius: 4px;
    cursor: pointer;

    a {
      white-space: normal;
      color: lighten($textColor, 35%);

      .page-title {
        font-weight: 600;
      }

      .header {
        font-size: 0.9em;
        margin-left: 0.25em;
      }
    }

    &.focused {
      background-color: #f3f4f5;

      a {
        color: $accentColor;
      }
    }
  }
}

@media (max-width: $MQNarrow) {
  .search-box {
    input {
      cursor: pointer;
      width: 0;
      border-color: transparent;
      position: relative;

      &:focus {
        cursor: text;
        left: 0;
        width: 10rem;
      }
    }
  }
}


@media all and (-ms-high-contrast: none) {
  .search-box input {
    height: 2rem;
  }
}

@media (max-width: $MQNarrow) and (min-width: $MQMobile) {
  .search-box {
    .suggestions {
      left: 0;
    }
  }
}

@media (max-width: $MQMobile) {
  .search-box {
    margin-right: 0;

    input {
      left: 1rem;
    }

    .suggestions {
      right: 0;
    }
  }
}

@media (max-width: $MQMobileNarrow) {
  .search-box {
    .suggestions {
      width: calc(100vw - 4rem);
    }

    input:focus {
      width: 8rem;
    }
  }
}

.text--primary {
  color: $accentColor;
}
</style>