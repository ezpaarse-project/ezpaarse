<template>
  <table>
    <thead>
      <tr>
        <th>Code</th>
        <th>
          Description
          <select v-model="lang">
            <option value="fr">Fr</option>
            <option value="en">En</option>
          </select>
        </th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="row in localizedRows">
        <td>
          {{ row.code }}
        </td>
        <td>
          {{ row.description }}
          <template v-if="row.comment">
            <br> {{ row.comment }}
          </template>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    rows: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      lang: 'en',
    };
  },
  computed: {
    localizedRows() {
      return this.rows.map(row => {
        return {
          ...row,
          description: this.lang === 'fr' ? row.description : row.description_en,
          comment: this.lang === 'fr' ? row.comment : row.comment_en,
        };
      });
    }
  }
}
</script>