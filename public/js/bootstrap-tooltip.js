  


<!DOCTYPE html>
<html>
  <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# githubog: http://ogp.me/ns/fb/githubog#">
    <meta charset='utf-8'>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>bootstrap/js/bootstrap-tooltip.js at master · twitter/bootstrap</title>
    <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="GitHub" />
    <link rel="fluid-icon" href="https://github.com/fluidicon.png" title="GitHub" />
    <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-114.png" />
    <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114.png" />
    <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-144.png" />
    <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144.png" />
    <link rel="logo" type="image/svg" href="http://github-media-downloads.s3.amazonaws.com/github-logo.svg" />
    <link rel="xhr-socket" href="/_sockets" />


    <meta name="msapplication-TileImage" content="/windows-tile.png" />
    <meta name="msapplication-TileColor" content="#ffffff" />
    <meta name="selected-link" value="repo_source" data-pjax-transient />
    <meta content="collector.githubapp.com" name="octolytics-host" /><meta content="github" name="octolytics-app-id" /><meta content="3366767" name="octolytics-actor-id" /><meta content="7dfdeb2b00ea5e0a7048c694c5df8a40a4f08359e72f4279719faee82acc471e" name="octolytics-actor-hash" />

    
    
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />

    <meta content="authenticity_token" name="csrf-param" />
<meta content="4JKYGuOIA2SHwYE5JJnjdL0AD1zLo68hxOci5GTK79s=" name="csrf-token" />

    <link href="https://a248.e.akamai.net/assets.github.com/assets/github-41bd430839f44e56f4954b9a987797fb820e7845.css" media="all" rel="stylesheet" type="text/css" />
    <link href="https://a248.e.akamai.net/assets.github.com/assets/github2-8672ae0800703e0f9939a001a34e43c3c87836b5.css" media="all" rel="stylesheet" type="text/css" />
    


      <script src="https://a248.e.akamai.net/assets.github.com/assets/frameworks-ec9348b8374c693b0749d0b95b215fe3f5414fd0.js" type="text/javascript"></script>
      <script src="https://a248.e.akamai.net/assets.github.com/assets/github-5ed450b261b3b303186d9febaf304db852ec3767.js" type="text/javascript"></script>
      
      <meta http-equiv="x-pjax-version" content="909e2d34f3499198e855b43104c04190">

        <link data-pjax-transient rel='permalink' href='/twitter/bootstrap/blob/d9b502dfb876c40b0735008bac18049c7ee7b6d2/js/bootstrap-tooltip.js'>
    <meta property="og:title" content="bootstrap"/>
    <meta property="og:type" content="githubog:gitrepository"/>
    <meta property="og:url" content="https://github.com/twitter/bootstrap"/>
    <meta property="og:image" content="https://secure.gravatar.com/avatar/2f4a8254d032a8ec5e4c48d461e54fcc?s=420&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png"/>
    <meta property="og:site_name" content="GitHub"/>
    <meta property="og:description" content="bootstrap - Sleek, intuitive, and powerful front-end framework for faster and easier web development."/>
    <meta property="twitter:card" content="summary"/>
    <meta property="twitter:site" content="@GitHub">
    <meta property="twitter:title" content="twitter/bootstrap"/>

    <meta name="description" content="bootstrap - Sleek, intuitive, and powerful front-end framework for faster and easier web development." />


    <meta content="50278" name="octolytics-dimension-user_id" /><meta content="2126244" name="octolytics-dimension-repository_id" />
  <link href="https://github.com/twitter/bootstrap/commits/master.atom" rel="alternate" title="Recent Commits to bootstrap:master" type="application/atom+xml" />

  </head>


  <body class="logged_in page-blob linux vis-public env-production  ">
    <div id="wrapper">

      
      
      

      <div class="header header-logged-in true">
  <div class="container clearfix">

    <a class="header-logo-invertocat" href="https://github.com/">
  <span class="mega-octicon octicon-mark-github"></span>
</a>

    <div class="divider-vertical"></div>

      <a href="/notifications" class="notification-indicator tooltipped downwards" title="You have no unread notifications">
    <span class="mail-status all-read"></span>
  </a>
  <div class="divider-vertical"></div>


      <div class="command-bar js-command-bar  in-repository">
          <form accept-charset="UTF-8" action="/search" class="command-bar-form" id="top_search_form" method="get">
  <a href="/search/advanced" class="advanced-search-icon tooltipped downwards command-bar-search" id="advanced_search" title="Advanced search"><span class="octicon octicon-gear "></span></a>

  <input type="text" data-hotkey="/ s" name="q" id="js-command-bar-field" placeholder="Search or type a command" tabindex="1" autocapitalize="off"
    data-username="Crow-EH"
      data-repo="twitter/bootstrap"
      data-branch="master"
      data-sha="ba3c81643a157d1f2ecaa94905f291c447c0ad6c"
  >

    <input type="hidden" name="nwo" value="twitter/bootstrap" />

    <div class="select-menu js-menu-container js-select-menu search-context-select-menu">
      <span class="minibutton select-menu-button js-menu-target">
        <span class="js-select-button">This repository</span>
      </span>

      <div class="select-menu-modal-holder js-menu-content js-navigation-container">
        <div class="select-menu-modal">

          <div class="select-menu-item js-navigation-item selected">
            <span class="select-menu-item-icon octicon octicon-check"></span>
            <input type="radio" class="js-search-this-repository" name="search_target" value="repository" checked="checked" />
            <div class="select-menu-item-text js-select-button-text">This repository</div>
          </div> <!-- /.select-menu-item -->

          <div class="select-menu-item js-navigation-item">
            <span class="select-menu-item-icon octicon octicon-check"></span>
            <input type="radio" name="search_target" value="global" />
            <div class="select-menu-item-text js-select-button-text">All repositories</div>
          </div> <!-- /.select-menu-item -->

        </div>
      </div>
    </div>

  <span class="octicon help tooltipped downwards" title="Show command bar help">
    <span class="octicon octicon-question"></span>
  </span>


  <input type="hidden" name="ref" value="cmdform">

  <div class="divider-vertical"></div>

</form>
        <ul class="top-nav">
            <li class="explore"><a href="/explore">Explore</a></li>
            <li><a href="https://gist.github.com">Gist</a></li>
            <li><a href="/blog">Blog</a></li>
          <li><a href="http://help.github.com">Help</a></li>
        </ul>
      </div>

    

  

    <ul id="user-links">
      <li>
        <a href="/Crow-EH" class="name">
          <img height="20" src="https://secure.gravatar.com/avatar/46475cbd518bd5d27a36b2e4f750fa08?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" width="20" /> Crow-EH
        </a>
      </li>

        <li>
          <a href="/new" id="new_repo" class="tooltipped downwards" title="Create a new repo">
            <span class="octicon octicon-repo-create"></span>
          </a>
        </li>

        <li>
          <a href="/settings/profile" id="account_settings"
            class="tooltipped downwards"
            title="Account settings ">
            <span class="octicon octicon-tools"></span>
          </a>
        </li>
        <li>
          <a class="tooltipped downwards" href="/logout" data-method="post" id="logout" title="Sign out">
            <span class="octicon octicon-log-out"></span>
          </a>
        </li>

    </ul>


<div class="js-new-dropdown-contents hidden">
  <ul class="dropdown-menu">
    <li>
      <a href="/new"><span class="octicon octicon-repo-create"></span> New repository</a>
    </li>
    <li>
        <a href="/twitter/bootstrap/issues/new"><span class="octicon octicon-issue-opened"></span> New issue</a>
    </li>
    <li>
    </li>
    <li>
      <a href="/organizations/new"><span class="octicon octicon-list-unordered"></span> New organization</a>
    </li>
  </ul>
</div>


    
  </div>
</div>

      

      


            <div class="site hfeed" itemscope itemtype="http://schema.org/WebPage">
      <div class="hentry">
        
        <div class="pagehead repohead instapaper_ignore readability-menu ">
          <div class="container">
            <div class="title-actions-bar">
              

<ul class="pagehead-actions">


    <li class="subscription">
      <form accept-charset="UTF-8" action="/notifications/subscribe" data-autosubmit="true" data-remote="true" method="post"><div style="margin:0;padding:0;display:inline"><input name="authenticity_token" type="hidden" value="4JKYGuOIA2SHwYE5JJnjdL0AD1zLo68hxOci5GTK79s=" /></div>  <input id="repository_id" name="repository_id" type="hidden" value="2126244" />

    <div class="select-menu js-menu-container js-select-menu">
      <span class="minibutton select-menu-button js-menu-target">
        <span class="js-select-button">
          <span class="octicon octicon-eye-watch"></span>
          Watch
        </span>
      </span>

      <div class="select-menu-modal-holder js-menu-content">
        <div class="select-menu-modal">
          <div class="select-menu-header">
            <span class="select-menu-title">Notification status</span>
            <span class="octicon octicon-remove-close js-menu-close"></span>
          </div> <!-- /.select-menu-header -->

          <div class="select-menu-list js-navigation-container">

            <div class="select-menu-item js-navigation-item selected">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <div class="select-menu-item-text">
                <input checked="checked" id="do_included" name="do" type="radio" value="included" />
                <h4>Not watching</h4>
                <span class="description">You only receive notifications for discussions in which you participate or are @mentioned.</span>
                <span class="js-select-button-text hidden-select-button-text">
                  <span class="octicon octicon-eye-watch"></span>
                  Watch
                </span>
              </div>
            </div> <!-- /.select-menu-item -->

            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon octicon-check"></span>
              <div class="select-menu-item-text">
                <input id="do_subscribed" name="do" type="radio" value="subscribed" />
                <h4>Watching</h4>
                <span class="description">You receive notifications for all discussions in this repository.</span>
                <span class="js-select-button-text hidden-select-button-text">
                  <span class="octicon octicon-eye-unwatch"></span>
                  Unwatch
                </span>
              </div>
            </div> <!-- /.select-menu-item -->

            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <div class="select-menu-item-text">
                <input id="do_ignore" name="do" type="radio" value="ignore" />
                <h4>Ignoring</h4>
                <span class="description">You do not receive any notifications for discussions in this repository.</span>
                <span class="js-select-button-text hidden-select-button-text">
                  <span class="octicon octicon-mute"></span>
                  Stop ignoring
                </span>
              </div>
            </div> <!-- /.select-menu-item -->

          </div> <!-- /.select-menu-list -->

        </div> <!-- /.select-menu-modal -->
      </div> <!-- /.select-menu-modal-holder -->
    </div> <!-- /.select-menu -->

</form>
    </li>

    <li class="js-toggler-container js-social-container starring-container ">
      <a href="/twitter/bootstrap/unstar" class="minibutton js-toggler-target star-button starred upwards" title="Unstar this repo" data-remote="true" data-method="post" rel="nofollow">
        <span class="octicon octicon-star-delete"></span>
        <span class="text">Unstar</span>
      </a>
      <a href="/twitter/bootstrap/star" class="minibutton js-toggler-target star-button unstarred upwards" title="Star this repo" data-remote="true" data-method="post" rel="nofollow">
        <span class="octicon octicon-star"></span>
        <span class="text">Star</span>
      </a>
      <a class="social-count js-social-count" href="/twitter/bootstrap/stargazers">50,897</a>
    </li>

        <li>
          <a href="/twitter/bootstrap/fork" class="minibutton js-toggler-target fork-button lighter upwards" title="Fork this repo" rel="nofollow" data-method="post">
            <span class="octicon octicon-git-branch-create"></span>
            <span class="text">Fork</span>
          </a>
          <a href="/twitter/bootstrap/network" class="social-count">16,030</a>
        </li>


</ul>

              <h1 itemscope itemtype="http://data-vocabulary.org/Breadcrumb" class="entry-title public">
                <span class="repo-label"><span>public</span></span>
                <span class="mega-octicon octicon-repo"></span>
                <span class="author vcard">
                  <a href="/twitter" class="url fn" itemprop="url" rel="author">
                  <span itemprop="title">twitter</span>
                  </a></span> /
                <strong><a href="/twitter/bootstrap" class="js-current-repository">bootstrap</a></strong>
              </h1>
            </div>

            
  <ul class="tabs">
    <li class="pulse-nav"><a href="/twitter/bootstrap/pulse" class="js-selected-navigation-item " data-selected-links="pulse /twitter/bootstrap/pulse" rel="nofollow"><span class="octicon octicon-pulse"></span></a></li>
    <li><a href="/twitter/bootstrap" class="js-selected-navigation-item selected" data-selected-links="repo_source repo_downloads repo_commits repo_tags repo_branches /twitter/bootstrap">Code</a></li>
    <li><a href="/twitter/bootstrap/network" class="js-selected-navigation-item " data-selected-links="repo_network /twitter/bootstrap/network">Network</a></li>
    <li><a href="/twitter/bootstrap/pulls" class="js-selected-navigation-item " data-selected-links="repo_pulls /twitter/bootstrap/pulls">Pull Requests <span class='counter'>53</span></a></li>

      <li><a href="/twitter/bootstrap/issues" class="js-selected-navigation-item " data-selected-links="repo_issues /twitter/bootstrap/issues">Issues <span class='counter'>167</span></a></li>

      <li><a href="/twitter/bootstrap/wiki" class="js-selected-navigation-item " data-selected-links="repo_wiki /twitter/bootstrap/wiki">Wiki</a></li>


    <li><a href="/twitter/bootstrap/graphs" class="js-selected-navigation-item " data-selected-links="repo_graphs repo_contributors /twitter/bootstrap/graphs">Graphs</a></li>


  </ul>
  
<div class="tabnav">

  <span class="tabnav-right">
    <ul class="tabnav-tabs">
          <li><a href="/twitter/bootstrap/tags" class="js-selected-navigation-item tabnav-tab" data-selected-links="repo_tags /twitter/bootstrap/tags">Tags <span class="counter ">19</span></a></li>
    </ul>
  </span>

  <div class="tabnav-widget scope">


    <div class="select-menu js-menu-container js-select-menu js-branch-menu">
      <a class="minibutton select-menu-button js-menu-target" data-hotkey="w" data-ref="master">
        <span class="octicon octicon-branch"></span>
        <i>branch:</i>
        <span class="js-select-button">master</span>
      </a>

      <div class="select-menu-modal-holder js-menu-content js-navigation-container">

        <div class="select-menu-modal">
          <div class="select-menu-header">
            <span class="select-menu-title">Switch branches/tags</span>
            <span class="octicon octicon-remove-close js-menu-close"></span>
          </div> <!-- /.select-menu-header -->

          <div class="select-menu-filters">
            <div class="select-menu-text-filter">
              <input type="text" id="commitish-filter-field" class="js-filterable-field js-navigation-enable" placeholder="Filter branches/tags">
            </div>
            <div class="select-menu-tabs">
              <ul>
                <li class="select-menu-tab">
                  <a href="#" data-tab-filter="branches" class="js-select-menu-tab">Branches</a>
                </li>
                <li class="select-menu-tab">
                  <a href="#" data-tab-filter="tags" class="js-select-menu-tab">Tags</a>
                </li>
              </ul>
            </div><!-- /.select-menu-tabs -->
          </div><!-- /.select-menu-filters -->

          <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket css-truncate" data-tab-filter="branches">

            <div data-filterable-for="commitish-filter-field" data-filterable-type="substring">

                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/twitter/bootstrap/blob/3.0.0-wip/js/bootstrap-tooltip.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="3.0.0-wip" rel="nofollow" title="3.0.0-wip">3.0.0-wip</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/twitter/bootstrap/blob/gh-pages/js/bootstrap-tooltip.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="gh-pages" rel="nofollow" title="gh-pages">gh-pages</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item selected">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/twitter/bootstrap/blob/master/js/bootstrap-tooltip.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="master" rel="nofollow" title="master">master</a>
                </div> <!-- /.select-menu-item -->
            </div>

              <div class="select-menu-no-results">Nothing to show</div>
          </div> <!-- /.select-menu-list -->


          <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket css-truncate" data-tab-filter="tags">
            <div data-filterable-for="commitish-filter-field" data-filterable-type="substring">

                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/twitter/bootstrap/blob/v2.3.2/js/bootstrap-tooltip.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="v2.3.2" rel="nofollow" title="v2.3.2">v2.3.2</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/twitter/bootstrap/blob/v2.3.1/js/bootstrap-tooltip.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="v2.3.1" rel="nofollow" title="v2.3.1">v2.3.1</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/twitter/bootstrap/blob/v2.3.0/js/bootstrap-tooltip.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="v2.3.0" rel="nofollow" title="v2.3.0">v2.3.0</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/twitter/bootstrap/blob/v2.2.2/js/bootstrap-tooltip.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="v2.2.2" rel="nofollow" title="v2.2.2">v2.2.2</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/twitter/bootstrap/blob/v2.2.1/js/bootstrap-tooltip.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="v2.2.1" rel="nofollow" title="v2.2.1">v2.2.1</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/twitter/bootstrap/blob/v2.2.0/js/bootstrap-tooltip.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="v2.2.0" rel="nofollow" title="v2.2.0">v2.2.0</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/twitter/bootstrap/blob/v2.1.1/js/bootstrap-tooltip.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="v2.1.1" rel="nofollow" title="v2.1.1">v2.1.1</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/twitter/bootstrap/blob/v2.1.0/js/bootstrap-tooltip.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="v2.1.0" rel="nofollow" title="v2.1.0">v2.1.0</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/twitter/bootstrap/blob/v2.0.4/js/bootstrap-tooltip.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="v2.0.4" rel="nofollow" title="v2.0.4">v2.0.4</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/twitter/bootstrap/blob/v2.0.3/js/bootstrap-tooltip.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="v2.0.3" rel="nofollow" title="v2.0.3">v2.0.3</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/twitter/bootstrap/blob/v2.0.2/js/bootstrap-tooltip.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="v2.0.2" rel="nofollow" title="v2.0.2">v2.0.2</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/twitter/bootstrap/blob/v2.0.1/js/bootstrap-tooltip.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="v2.0.1" rel="nofollow" title="v2.0.1">v2.0.1</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/twitter/bootstrap/blob/v2.0.0/js/bootstrap-tooltip.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="v2.0.0" rel="nofollow" title="v2.0.0">v2.0.0</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/twitter/bootstrap/blob/v1.4.0/js/bootstrap-tooltip.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="v1.4.0" rel="nofollow" title="v1.4.0">v1.4.0</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/twitter/bootstrap/blob/v1.3.0/js/bootstrap-tooltip.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="v1.3.0" rel="nofollow" title="v1.3.0">v1.3.0</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/twitter/bootstrap/blob/v1.2.0/js/bootstrap-tooltip.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="v1.2.0" rel="nofollow" title="v1.2.0">v1.2.0</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/twitter/bootstrap/blob/v1.1.1/js/bootstrap-tooltip.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="v1.1.1" rel="nofollow" title="v1.1.1">v1.1.1</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/twitter/bootstrap/blob/v1.1.0/js/bootstrap-tooltip.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="v1.1.0" rel="nofollow" title="v1.1.0">v1.1.0</a>
                </div> <!-- /.select-menu-item -->
                <div class="select-menu-item js-navigation-item ">
                  <span class="select-menu-item-icon octicon octicon-check"></span>
                  <a href="/twitter/bootstrap/blob/v1.0.0/js/bootstrap-tooltip.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="v1.0.0" rel="nofollow" title="v1.0.0">v1.0.0</a>
                </div> <!-- /.select-menu-item -->
            </div>

            <div class="select-menu-no-results">Nothing to show</div>

          </div> <!-- /.select-menu-list -->

        </div> <!-- /.select-menu-modal -->
      </div> <!-- /.select-menu-modal-holder -->
    </div> <!-- /.select-menu -->

  </div> <!-- /.scope -->

  <ul class="tabnav-tabs">
    <li><a href="/twitter/bootstrap" class="selected js-selected-navigation-item tabnav-tab" data-selected-links="repo_source /twitter/bootstrap">Files</a></li>
    <li><a href="/twitter/bootstrap/commits/master" class="js-selected-navigation-item tabnav-tab" data-selected-links="repo_commits /twitter/bootstrap/commits/master">Commits</a></li>
    <li><a href="/twitter/bootstrap/branches" class="js-selected-navigation-item tabnav-tab" data-selected-links="repo_branches /twitter/bootstrap/branches" rel="nofollow">Branches <span class="counter ">3</span></a></li>
  </ul>

</div>

  
  
  


            
          </div>
        </div><!-- /.repohead -->

        <div id="js-repo-pjax-container" class="container context-loader-container" data-pjax-container>
          


<!-- blob contrib key: blob_contributors:v21:b8afe144a370396e802f17b94fcd161e -->
<!-- blob contrib frag key: views10/v8/blob_contributors:v21:b8afe144a370396e802f17b94fcd161e -->


<div id="slider">
    <div class="frame-meta">

      <p title="This is a placeholder element" class="js-history-link-replace hidden"></p>

        <div class="breadcrumb">
          <span class='bold'><span itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/twitter/bootstrap" class="js-slide-to" data-branch="master" data-direction="back" itemscope="url"><span itemprop="title">bootstrap</span></a></span></span><span class="separator"> / </span><span itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/twitter/bootstrap/tree/master/js" class="js-slide-to" data-branch="master" data-direction="back" itemscope="url"><span itemprop="title">js</span></a></span><span class="separator"> / </span><strong class="final-path">bootstrap-tooltip.js</strong> <span class="js-zeroclipboard zeroclipboard-button" data-clipboard-text="js/bootstrap-tooltip.js" data-copied-hint="copied!" title="copy to clipboard"><span class="octicon octicon-clippy"></span></span>
        </div>

      <a href="/twitter/bootstrap/find/master" class="js-slide-to" data-hotkey="t" style="display:none">Show File Finder</a>


        
  <div class="commit file-history-tease">
    <img class="main-avatar" height="24" src="https://secure.gravatar.com/avatar/a98244cbdacaf1c0b55499466002f7a8?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" width="24" />
    <span class="author"><a href="/fat" rel="author">fat</a></span>
    <time class="js-relative-date" datetime="2013-05-17T10:20:13-07:00" title="2013-05-17 10:20:13">May 17, 2013</time>
    <div class="commit-title">
        <a href="/twitter/bootstrap/commit/c9789f75153539a0ca0a2f31234716f527024333" class="message">update versioning to 2.3.2</a>
    </div>

    <div class="participation">
      <p class="quickstat"><a href="#blob_contributors_box" rel="facebox"><strong>11</strong> contributors</a></p>
          <a class="avatar tooltipped downwards" title="fat" href="/twitter/bootstrap/commits/master/js/bootstrap-tooltip.js?author=fat"><img height="20" src="https://secure.gravatar.com/avatar/a98244cbdacaf1c0b55499466002f7a8?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" width="20" /></a>
    <a class="avatar tooltipped downwards" title="mdo" href="/twitter/bootstrap/commits/master/js/bootstrap-tooltip.js?author=mdo"><img height="20" src="https://secure.gravatar.com/avatar/bc4ab438f7a4ce1c406aadc688427f2c?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" width="20" /></a>
    <a class="avatar tooltipped downwards" title="lookfirst" href="/twitter/bootstrap/commits/master/js/bootstrap-tooltip.js?author=lookfirst"><img height="20" src="https://secure.gravatar.com/avatar/0797402e2558924b62845d0ac0fddbb3?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" width="20" /></a>
    <a class="avatar tooltipped downwards" title="Yohn" href="/twitter/bootstrap/commits/master/js/bootstrap-tooltip.js?author=Yohn"><img height="20" src="https://secure.gravatar.com/avatar/797fa1f0a9b0d08fe379be614b4a9ba4?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" width="20" /></a>
    <a class="avatar tooltipped downwards" title="ghusse" href="/twitter/bootstrap/commits/master/js/bootstrap-tooltip.js?author=ghusse"><img height="20" src="https://secure.gravatar.com/avatar/e815e852e96b7d5fabe001cdd9c78ba3?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" width="20" /></a>
    <a class="avatar tooltipped downwards" title="tkawachi" href="/twitter/bootstrap/commits/master/js/bootstrap-tooltip.js?author=tkawachi"><img height="20" src="https://secure.gravatar.com/avatar/35ea8f83cd8d191f834c69a5481613e9?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" width="20" /></a>
    <a class="avatar tooltipped downwards" title="jorgenfb" href="/twitter/bootstrap/commits/master/js/bootstrap-tooltip.js?author=jorgenfb"><img height="20" src="https://secure.gravatar.com/avatar/8c812a3c6f5ff8991088c181709315c9?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" width="20" /></a>
    <a class="avatar tooltipped downwards" title="renajohn" href="/twitter/bootstrap/commits/master/js/bootstrap-tooltip.js?author=renajohn"><img height="20" src="https://secure.gravatar.com/avatar/52df8f06e6c1ebb6a9bb9ebde2f36bc8?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" width="20" /></a>
    <a class="avatar tooltipped downwards" title="gsmet" href="/twitter/bootstrap/commits/master/js/bootstrap-tooltip.js?author=gsmet"><img height="20" src="https://secure.gravatar.com/avatar/ec96387a1a8295b6fd6dffb68f80c352?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" width="20" /></a>
    <a class="avatar tooltipped downwards" title="joprice" href="/twitter/bootstrap/commits/master/js/bootstrap-tooltip.js?author=joprice"><img height="20" src="https://secure.gravatar.com/avatar/9ee7c08fbca4f76545a2ce129e53bbd0?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" width="20" /></a>
    <a class="avatar tooltipped downwards" title="frntz" href="/twitter/bootstrap/commits/master/js/bootstrap-tooltip.js?author=frntz"><img height="20" src="https://secure.gravatar.com/avatar/7cd7cee2f20fad171bf0b7b2b148f69b?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" width="20" /></a>


    </div>
    <div id="blob_contributors_box" style="display:none">
      <h2>Users on GitHub who have contributed to this file</h2>
      <ul class="facebox-user-list">
        <li>
          <img height="24" src="https://secure.gravatar.com/avatar/a98244cbdacaf1c0b55499466002f7a8?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" width="24" />
          <a href="/fat">fat</a>
        </li>
        <li>
          <img height="24" src="https://secure.gravatar.com/avatar/bc4ab438f7a4ce1c406aadc688427f2c?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" width="24" />
          <a href="/mdo">mdo</a>
        </li>
        <li>
          <img height="24" src="https://secure.gravatar.com/avatar/0797402e2558924b62845d0ac0fddbb3?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" width="24" />
          <a href="/lookfirst">lookfirst</a>
        </li>
        <li>
          <img height="24" src="https://secure.gravatar.com/avatar/797fa1f0a9b0d08fe379be614b4a9ba4?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" width="24" />
          <a href="/Yohn">Yohn</a>
        </li>
        <li>
          <img height="24" src="https://secure.gravatar.com/avatar/e815e852e96b7d5fabe001cdd9c78ba3?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" width="24" />
          <a href="/ghusse">ghusse</a>
        </li>
        <li>
          <img height="24" src="https://secure.gravatar.com/avatar/35ea8f83cd8d191f834c69a5481613e9?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" width="24" />
          <a href="/tkawachi">tkawachi</a>
        </li>
        <li>
          <img height="24" src="https://secure.gravatar.com/avatar/8c812a3c6f5ff8991088c181709315c9?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" width="24" />
          <a href="/jorgenfb">jorgenfb</a>
        </li>
        <li>
          <img height="24" src="https://secure.gravatar.com/avatar/52df8f06e6c1ebb6a9bb9ebde2f36bc8?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" width="24" />
          <a href="/renajohn">renajohn</a>
        </li>
        <li>
          <img height="24" src="https://secure.gravatar.com/avatar/ec96387a1a8295b6fd6dffb68f80c352?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" width="24" />
          <a href="/gsmet">gsmet</a>
        </li>
        <li>
          <img height="24" src="https://secure.gravatar.com/avatar/9ee7c08fbca4f76545a2ce129e53bbd0?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" width="24" />
          <a href="/joprice">joprice</a>
        </li>
        <li>
          <img height="24" src="https://secure.gravatar.com/avatar/7cd7cee2f20fad171bf0b7b2b148f69b?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" width="24" />
          <a href="/frntz">frntz</a>
        </li>
      </ul>
    </div>
  </div>


    </div><!-- ./.frame-meta -->

    <div class="frames">
      <div class="frame" data-permalink-url="/twitter/bootstrap/blob/d9b502dfb876c40b0735008bac18049c7ee7b6d2/js/bootstrap-tooltip.js" data-title="bootstrap/js/bootstrap-tooltip.js at master · twitter/bootstrap · GitHub" data-type="blob">

        <div id="files" class="bubble">
          <div class="file">
            <div class="meta">
              <div class="info">
                <span class="icon"><b class="octicon octicon-file-text"></b></span>
                <span class="mode" title="File Mode">file</span>
                  <span>362 lines (283 sloc)</span>
                <span>9.911 kb</span>
              </div>
              <div class="actions">
                <div class="button-group">
                        <a class="minibutton tooltipped leftwards"
                           title="Clicking this button will automatically fork this project so you can edit the file"
                           href="/twitter/bootstrap/edit/master/js/bootstrap-tooltip.js"
                           data-method="post" rel="nofollow">Edit</a>
                  <a href="/twitter/bootstrap/raw/master/js/bootstrap-tooltip.js" class="button minibutton " id="raw-url">Raw</a>
                    <a href="/twitter/bootstrap/blame/master/js/bootstrap-tooltip.js" class="button minibutton ">Blame</a>
                  <a href="/twitter/bootstrap/commits/master/js/bootstrap-tooltip.js" class="button minibutton " rel="nofollow">History</a>
                </div><!-- /.button-group -->
              </div><!-- /.actions -->

            </div>
                <div class="blob-wrapper data type-javascript js-blob-data">
      <table class="file-code file-diff">
        <tr class="file-code-line">
          <td class="blob-line-nums">
            <span id="L1" rel="#L1">1</span>
<span id="L2" rel="#L2">2</span>
<span id="L3" rel="#L3">3</span>
<span id="L4" rel="#L4">4</span>
<span id="L5" rel="#L5">5</span>
<span id="L6" rel="#L6">6</span>
<span id="L7" rel="#L7">7</span>
<span id="L8" rel="#L8">8</span>
<span id="L9" rel="#L9">9</span>
<span id="L10" rel="#L10">10</span>
<span id="L11" rel="#L11">11</span>
<span id="L12" rel="#L12">12</span>
<span id="L13" rel="#L13">13</span>
<span id="L14" rel="#L14">14</span>
<span id="L15" rel="#L15">15</span>
<span id="L16" rel="#L16">16</span>
<span id="L17" rel="#L17">17</span>
<span id="L18" rel="#L18">18</span>
<span id="L19" rel="#L19">19</span>
<span id="L20" rel="#L20">20</span>
<span id="L21" rel="#L21">21</span>
<span id="L22" rel="#L22">22</span>
<span id="L23" rel="#L23">23</span>
<span id="L24" rel="#L24">24</span>
<span id="L25" rel="#L25">25</span>
<span id="L26" rel="#L26">26</span>
<span id="L27" rel="#L27">27</span>
<span id="L28" rel="#L28">28</span>
<span id="L29" rel="#L29">29</span>
<span id="L30" rel="#L30">30</span>
<span id="L31" rel="#L31">31</span>
<span id="L32" rel="#L32">32</span>
<span id="L33" rel="#L33">33</span>
<span id="L34" rel="#L34">34</span>
<span id="L35" rel="#L35">35</span>
<span id="L36" rel="#L36">36</span>
<span id="L37" rel="#L37">37</span>
<span id="L38" rel="#L38">38</span>
<span id="L39" rel="#L39">39</span>
<span id="L40" rel="#L40">40</span>
<span id="L41" rel="#L41">41</span>
<span id="L42" rel="#L42">42</span>
<span id="L43" rel="#L43">43</span>
<span id="L44" rel="#L44">44</span>
<span id="L45" rel="#L45">45</span>
<span id="L46" rel="#L46">46</span>
<span id="L47" rel="#L47">47</span>
<span id="L48" rel="#L48">48</span>
<span id="L49" rel="#L49">49</span>
<span id="L50" rel="#L50">50</span>
<span id="L51" rel="#L51">51</span>
<span id="L52" rel="#L52">52</span>
<span id="L53" rel="#L53">53</span>
<span id="L54" rel="#L54">54</span>
<span id="L55" rel="#L55">55</span>
<span id="L56" rel="#L56">56</span>
<span id="L57" rel="#L57">57</span>
<span id="L58" rel="#L58">58</span>
<span id="L59" rel="#L59">59</span>
<span id="L60" rel="#L60">60</span>
<span id="L61" rel="#L61">61</span>
<span id="L62" rel="#L62">62</span>
<span id="L63" rel="#L63">63</span>
<span id="L64" rel="#L64">64</span>
<span id="L65" rel="#L65">65</span>
<span id="L66" rel="#L66">66</span>
<span id="L67" rel="#L67">67</span>
<span id="L68" rel="#L68">68</span>
<span id="L69" rel="#L69">69</span>
<span id="L70" rel="#L70">70</span>
<span id="L71" rel="#L71">71</span>
<span id="L72" rel="#L72">72</span>
<span id="L73" rel="#L73">73</span>
<span id="L74" rel="#L74">74</span>
<span id="L75" rel="#L75">75</span>
<span id="L76" rel="#L76">76</span>
<span id="L77" rel="#L77">77</span>
<span id="L78" rel="#L78">78</span>
<span id="L79" rel="#L79">79</span>
<span id="L80" rel="#L80">80</span>
<span id="L81" rel="#L81">81</span>
<span id="L82" rel="#L82">82</span>
<span id="L83" rel="#L83">83</span>
<span id="L84" rel="#L84">84</span>
<span id="L85" rel="#L85">85</span>
<span id="L86" rel="#L86">86</span>
<span id="L87" rel="#L87">87</span>
<span id="L88" rel="#L88">88</span>
<span id="L89" rel="#L89">89</span>
<span id="L90" rel="#L90">90</span>
<span id="L91" rel="#L91">91</span>
<span id="L92" rel="#L92">92</span>
<span id="L93" rel="#L93">93</span>
<span id="L94" rel="#L94">94</span>
<span id="L95" rel="#L95">95</span>
<span id="L96" rel="#L96">96</span>
<span id="L97" rel="#L97">97</span>
<span id="L98" rel="#L98">98</span>
<span id="L99" rel="#L99">99</span>
<span id="L100" rel="#L100">100</span>
<span id="L101" rel="#L101">101</span>
<span id="L102" rel="#L102">102</span>
<span id="L103" rel="#L103">103</span>
<span id="L104" rel="#L104">104</span>
<span id="L105" rel="#L105">105</span>
<span id="L106" rel="#L106">106</span>
<span id="L107" rel="#L107">107</span>
<span id="L108" rel="#L108">108</span>
<span id="L109" rel="#L109">109</span>
<span id="L110" rel="#L110">110</span>
<span id="L111" rel="#L111">111</span>
<span id="L112" rel="#L112">112</span>
<span id="L113" rel="#L113">113</span>
<span id="L114" rel="#L114">114</span>
<span id="L115" rel="#L115">115</span>
<span id="L116" rel="#L116">116</span>
<span id="L117" rel="#L117">117</span>
<span id="L118" rel="#L118">118</span>
<span id="L119" rel="#L119">119</span>
<span id="L120" rel="#L120">120</span>
<span id="L121" rel="#L121">121</span>
<span id="L122" rel="#L122">122</span>
<span id="L123" rel="#L123">123</span>
<span id="L124" rel="#L124">124</span>
<span id="L125" rel="#L125">125</span>
<span id="L126" rel="#L126">126</span>
<span id="L127" rel="#L127">127</span>
<span id="L128" rel="#L128">128</span>
<span id="L129" rel="#L129">129</span>
<span id="L130" rel="#L130">130</span>
<span id="L131" rel="#L131">131</span>
<span id="L132" rel="#L132">132</span>
<span id="L133" rel="#L133">133</span>
<span id="L134" rel="#L134">134</span>
<span id="L135" rel="#L135">135</span>
<span id="L136" rel="#L136">136</span>
<span id="L137" rel="#L137">137</span>
<span id="L138" rel="#L138">138</span>
<span id="L139" rel="#L139">139</span>
<span id="L140" rel="#L140">140</span>
<span id="L141" rel="#L141">141</span>
<span id="L142" rel="#L142">142</span>
<span id="L143" rel="#L143">143</span>
<span id="L144" rel="#L144">144</span>
<span id="L145" rel="#L145">145</span>
<span id="L146" rel="#L146">146</span>
<span id="L147" rel="#L147">147</span>
<span id="L148" rel="#L148">148</span>
<span id="L149" rel="#L149">149</span>
<span id="L150" rel="#L150">150</span>
<span id="L151" rel="#L151">151</span>
<span id="L152" rel="#L152">152</span>
<span id="L153" rel="#L153">153</span>
<span id="L154" rel="#L154">154</span>
<span id="L155" rel="#L155">155</span>
<span id="L156" rel="#L156">156</span>
<span id="L157" rel="#L157">157</span>
<span id="L158" rel="#L158">158</span>
<span id="L159" rel="#L159">159</span>
<span id="L160" rel="#L160">160</span>
<span id="L161" rel="#L161">161</span>
<span id="L162" rel="#L162">162</span>
<span id="L163" rel="#L163">163</span>
<span id="L164" rel="#L164">164</span>
<span id="L165" rel="#L165">165</span>
<span id="L166" rel="#L166">166</span>
<span id="L167" rel="#L167">167</span>
<span id="L168" rel="#L168">168</span>
<span id="L169" rel="#L169">169</span>
<span id="L170" rel="#L170">170</span>
<span id="L171" rel="#L171">171</span>
<span id="L172" rel="#L172">172</span>
<span id="L173" rel="#L173">173</span>
<span id="L174" rel="#L174">174</span>
<span id="L175" rel="#L175">175</span>
<span id="L176" rel="#L176">176</span>
<span id="L177" rel="#L177">177</span>
<span id="L178" rel="#L178">178</span>
<span id="L179" rel="#L179">179</span>
<span id="L180" rel="#L180">180</span>
<span id="L181" rel="#L181">181</span>
<span id="L182" rel="#L182">182</span>
<span id="L183" rel="#L183">183</span>
<span id="L184" rel="#L184">184</span>
<span id="L185" rel="#L185">185</span>
<span id="L186" rel="#L186">186</span>
<span id="L187" rel="#L187">187</span>
<span id="L188" rel="#L188">188</span>
<span id="L189" rel="#L189">189</span>
<span id="L190" rel="#L190">190</span>
<span id="L191" rel="#L191">191</span>
<span id="L192" rel="#L192">192</span>
<span id="L193" rel="#L193">193</span>
<span id="L194" rel="#L194">194</span>
<span id="L195" rel="#L195">195</span>
<span id="L196" rel="#L196">196</span>
<span id="L197" rel="#L197">197</span>
<span id="L198" rel="#L198">198</span>
<span id="L199" rel="#L199">199</span>
<span id="L200" rel="#L200">200</span>
<span id="L201" rel="#L201">201</span>
<span id="L202" rel="#L202">202</span>
<span id="L203" rel="#L203">203</span>
<span id="L204" rel="#L204">204</span>
<span id="L205" rel="#L205">205</span>
<span id="L206" rel="#L206">206</span>
<span id="L207" rel="#L207">207</span>
<span id="L208" rel="#L208">208</span>
<span id="L209" rel="#L209">209</span>
<span id="L210" rel="#L210">210</span>
<span id="L211" rel="#L211">211</span>
<span id="L212" rel="#L212">212</span>
<span id="L213" rel="#L213">213</span>
<span id="L214" rel="#L214">214</span>
<span id="L215" rel="#L215">215</span>
<span id="L216" rel="#L216">216</span>
<span id="L217" rel="#L217">217</span>
<span id="L218" rel="#L218">218</span>
<span id="L219" rel="#L219">219</span>
<span id="L220" rel="#L220">220</span>
<span id="L221" rel="#L221">221</span>
<span id="L222" rel="#L222">222</span>
<span id="L223" rel="#L223">223</span>
<span id="L224" rel="#L224">224</span>
<span id="L225" rel="#L225">225</span>
<span id="L226" rel="#L226">226</span>
<span id="L227" rel="#L227">227</span>
<span id="L228" rel="#L228">228</span>
<span id="L229" rel="#L229">229</span>
<span id="L230" rel="#L230">230</span>
<span id="L231" rel="#L231">231</span>
<span id="L232" rel="#L232">232</span>
<span id="L233" rel="#L233">233</span>
<span id="L234" rel="#L234">234</span>
<span id="L235" rel="#L235">235</span>
<span id="L236" rel="#L236">236</span>
<span id="L237" rel="#L237">237</span>
<span id="L238" rel="#L238">238</span>
<span id="L239" rel="#L239">239</span>
<span id="L240" rel="#L240">240</span>
<span id="L241" rel="#L241">241</span>
<span id="L242" rel="#L242">242</span>
<span id="L243" rel="#L243">243</span>
<span id="L244" rel="#L244">244</span>
<span id="L245" rel="#L245">245</span>
<span id="L246" rel="#L246">246</span>
<span id="L247" rel="#L247">247</span>
<span id="L248" rel="#L248">248</span>
<span id="L249" rel="#L249">249</span>
<span id="L250" rel="#L250">250</span>
<span id="L251" rel="#L251">251</span>
<span id="L252" rel="#L252">252</span>
<span id="L253" rel="#L253">253</span>
<span id="L254" rel="#L254">254</span>
<span id="L255" rel="#L255">255</span>
<span id="L256" rel="#L256">256</span>
<span id="L257" rel="#L257">257</span>
<span id="L258" rel="#L258">258</span>
<span id="L259" rel="#L259">259</span>
<span id="L260" rel="#L260">260</span>
<span id="L261" rel="#L261">261</span>
<span id="L262" rel="#L262">262</span>
<span id="L263" rel="#L263">263</span>
<span id="L264" rel="#L264">264</span>
<span id="L265" rel="#L265">265</span>
<span id="L266" rel="#L266">266</span>
<span id="L267" rel="#L267">267</span>
<span id="L268" rel="#L268">268</span>
<span id="L269" rel="#L269">269</span>
<span id="L270" rel="#L270">270</span>
<span id="L271" rel="#L271">271</span>
<span id="L272" rel="#L272">272</span>
<span id="L273" rel="#L273">273</span>
<span id="L274" rel="#L274">274</span>
<span id="L275" rel="#L275">275</span>
<span id="L276" rel="#L276">276</span>
<span id="L277" rel="#L277">277</span>
<span id="L278" rel="#L278">278</span>
<span id="L279" rel="#L279">279</span>
<span id="L280" rel="#L280">280</span>
<span id="L281" rel="#L281">281</span>
<span id="L282" rel="#L282">282</span>
<span id="L283" rel="#L283">283</span>
<span id="L284" rel="#L284">284</span>
<span id="L285" rel="#L285">285</span>
<span id="L286" rel="#L286">286</span>
<span id="L287" rel="#L287">287</span>
<span id="L288" rel="#L288">288</span>
<span id="L289" rel="#L289">289</span>
<span id="L290" rel="#L290">290</span>
<span id="L291" rel="#L291">291</span>
<span id="L292" rel="#L292">292</span>
<span id="L293" rel="#L293">293</span>
<span id="L294" rel="#L294">294</span>
<span id="L295" rel="#L295">295</span>
<span id="L296" rel="#L296">296</span>
<span id="L297" rel="#L297">297</span>
<span id="L298" rel="#L298">298</span>
<span id="L299" rel="#L299">299</span>
<span id="L300" rel="#L300">300</span>
<span id="L301" rel="#L301">301</span>
<span id="L302" rel="#L302">302</span>
<span id="L303" rel="#L303">303</span>
<span id="L304" rel="#L304">304</span>
<span id="L305" rel="#L305">305</span>
<span id="L306" rel="#L306">306</span>
<span id="L307" rel="#L307">307</span>
<span id="L308" rel="#L308">308</span>
<span id="L309" rel="#L309">309</span>
<span id="L310" rel="#L310">310</span>
<span id="L311" rel="#L311">311</span>
<span id="L312" rel="#L312">312</span>
<span id="L313" rel="#L313">313</span>
<span id="L314" rel="#L314">314</span>
<span id="L315" rel="#L315">315</span>
<span id="L316" rel="#L316">316</span>
<span id="L317" rel="#L317">317</span>
<span id="L318" rel="#L318">318</span>
<span id="L319" rel="#L319">319</span>
<span id="L320" rel="#L320">320</span>
<span id="L321" rel="#L321">321</span>
<span id="L322" rel="#L322">322</span>
<span id="L323" rel="#L323">323</span>
<span id="L324" rel="#L324">324</span>
<span id="L325" rel="#L325">325</span>
<span id="L326" rel="#L326">326</span>
<span id="L327" rel="#L327">327</span>
<span id="L328" rel="#L328">328</span>
<span id="L329" rel="#L329">329</span>
<span id="L330" rel="#L330">330</span>
<span id="L331" rel="#L331">331</span>
<span id="L332" rel="#L332">332</span>
<span id="L333" rel="#L333">333</span>
<span id="L334" rel="#L334">334</span>
<span id="L335" rel="#L335">335</span>
<span id="L336" rel="#L336">336</span>
<span id="L337" rel="#L337">337</span>
<span id="L338" rel="#L338">338</span>
<span id="L339" rel="#L339">339</span>
<span id="L340" rel="#L340">340</span>
<span id="L341" rel="#L341">341</span>
<span id="L342" rel="#L342">342</span>
<span id="L343" rel="#L343">343</span>
<span id="L344" rel="#L344">344</span>
<span id="L345" rel="#L345">345</span>
<span id="L346" rel="#L346">346</span>
<span id="L347" rel="#L347">347</span>
<span id="L348" rel="#L348">348</span>
<span id="L349" rel="#L349">349</span>
<span id="L350" rel="#L350">350</span>
<span id="L351" rel="#L351">351</span>
<span id="L352" rel="#L352">352</span>
<span id="L353" rel="#L353">353</span>
<span id="L354" rel="#L354">354</span>
<span id="L355" rel="#L355">355</span>
<span id="L356" rel="#L356">356</span>
<span id="L357" rel="#L357">357</span>
<span id="L358" rel="#L358">358</span>
<span id="L359" rel="#L359">359</span>
<span id="L360" rel="#L360">360</span>
<span id="L361" rel="#L361">361</span>

          </td>
          <td class="blob-line-code">
                  <div class="highlight"><pre><div class='line' id='LC1'><span class="cm">/* ===========================================================</span></div><div class='line' id='LC2'><span class="cm"> * bootstrap-tooltip.js v2.3.2</span></div><div class='line' id='LC3'><span class="cm"> * http://twitter.github.com/bootstrap/javascript.html#tooltips</span></div><div class='line' id='LC4'><span class="cm"> * Inspired by the original jQuery.tipsy by Jason Frame</span></div><div class='line' id='LC5'><span class="cm"> * ===========================================================</span></div><div class='line' id='LC6'><span class="cm"> * Copyright 2012 Twitter, Inc.</span></div><div class='line' id='LC7'><span class="cm"> *</span></div><div class='line' id='LC8'><span class="cm"> * Licensed under the Apache License, Version 2.0 (the &quot;License&quot;);</span></div><div class='line' id='LC9'><span class="cm"> * you may not use this file except in compliance with the License.</span></div><div class='line' id='LC10'><span class="cm"> * You may obtain a copy of the License at</span></div><div class='line' id='LC11'><span class="cm"> *</span></div><div class='line' id='LC12'><span class="cm"> * http://www.apache.org/licenses/LICENSE-2.0</span></div><div class='line' id='LC13'><span class="cm"> *</span></div><div class='line' id='LC14'><span class="cm"> * Unless required by applicable law or agreed to in writing, software</span></div><div class='line' id='LC15'><span class="cm"> * distributed under the License is distributed on an &quot;AS IS&quot; BASIS,</span></div><div class='line' id='LC16'><span class="cm"> * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.</span></div><div class='line' id='LC17'><span class="cm"> * See the License for the specific language governing permissions and</span></div><div class='line' id='LC18'><span class="cm"> * limitations under the License.</span></div><div class='line' id='LC19'><span class="cm"> * ========================================================== */</span></div><div class='line' id='LC20'><br/></div><div class='line' id='LC21'><br/></div><div class='line' id='LC22'><span class="o">!</span><span class="kd">function</span> <span class="p">(</span><span class="nx">$</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC23'><br/></div><div class='line' id='LC24'>&nbsp;&nbsp;<span class="s2">&quot;use strict&quot;</span><span class="p">;</span> <span class="c1">// jshint ;_;</span></div><div class='line' id='LC25'><br/></div><div class='line' id='LC26'><br/></div><div class='line' id='LC27'>&nbsp;<span class="cm">/* TOOLTIP PUBLIC CLASS DEFINITION</span></div><div class='line' id='LC28'><span class="cm">  * =============================== */</span></div><div class='line' id='LC29'><br/></div><div class='line' id='LC30'>&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">Tooltip</span> <span class="o">=</span> <span class="kd">function</span> <span class="p">(</span><span class="nx">element</span><span class="p">,</span> <span class="nx">options</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC31'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">init</span><span class="p">(</span><span class="s1">&#39;tooltip&#39;</span><span class="p">,</span> <span class="nx">element</span><span class="p">,</span> <span class="nx">options</span><span class="p">)</span></div><div class='line' id='LC32'>&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC33'><br/></div><div class='line' id='LC34'>&nbsp;&nbsp;<span class="nx">Tooltip</span><span class="p">.</span><span class="nx">prototype</span> <span class="o">=</span> <span class="p">{</span></div><div class='line' id='LC35'><br/></div><div class='line' id='LC36'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">constructor</span><span class="o">:</span> <span class="nx">Tooltip</span></div><div class='line' id='LC37'><br/></div><div class='line' id='LC38'>&nbsp;&nbsp;<span class="p">,</span> <span class="nx">init</span><span class="o">:</span> <span class="kd">function</span> <span class="p">(</span><span class="nx">type</span><span class="p">,</span> <span class="nx">element</span><span class="p">,</span> <span class="nx">options</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC39'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">eventIn</span></div><div class='line' id='LC40'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">,</span> <span class="nx">eventOut</span></div><div class='line' id='LC41'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">,</span> <span class="nx">triggers</span></div><div class='line' id='LC42'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">,</span> <span class="nx">trigger</span></div><div class='line' id='LC43'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">,</span> <span class="nx">i</span></div><div class='line' id='LC44'><br/></div><div class='line' id='LC45'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">type</span> <span class="o">=</span> <span class="nx">type</span></div><div class='line' id='LC46'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">$element</span> <span class="o">=</span> <span class="nx">$</span><span class="p">(</span><span class="nx">element</span><span class="p">)</span></div><div class='line' id='LC47'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">options</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">getOptions</span><span class="p">(</span><span class="nx">options</span><span class="p">)</span></div><div class='line' id='LC48'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">enabled</span> <span class="o">=</span> <span class="kc">true</span></div><div class='line' id='LC49'><br/></div><div class='line' id='LC50'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">triggers</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">trigger</span><span class="p">.</span><span class="nx">split</span><span class="p">(</span><span class="s1">&#39; &#39;</span><span class="p">)</span></div><div class='line' id='LC51'><br/></div><div class='line' id='LC52'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">for</span> <span class="p">(</span><span class="nx">i</span> <span class="o">=</span> <span class="nx">triggers</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span> <span class="nx">i</span><span class="o">--</span><span class="p">;)</span> <span class="p">{</span></div><div class='line' id='LC53'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">trigger</span> <span class="o">=</span> <span class="nx">triggers</span><span class="p">[</span><span class="nx">i</span><span class="p">]</span></div><div class='line' id='LC54'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">trigger</span> <span class="o">==</span> <span class="s1">&#39;click&#39;</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC55'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">$element</span><span class="p">.</span><span class="nx">on</span><span class="p">(</span><span class="s1">&#39;click.&#39;</span> <span class="o">+</span> <span class="k">this</span><span class="p">.</span><span class="nx">type</span><span class="p">,</span> <span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">selector</span><span class="p">,</span> <span class="nx">$</span><span class="p">.</span><span class="nx">proxy</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">toggle</span><span class="p">,</span> <span class="k">this</span><span class="p">))</span></div><div class='line' id='LC56'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="k">if</span> <span class="p">(</span><span class="nx">trigger</span> <span class="o">!=</span> <span class="s1">&#39;manual&#39;</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC57'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">eventIn</span> <span class="o">=</span> <span class="nx">trigger</span> <span class="o">==</span> <span class="s1">&#39;hover&#39;</span> <span class="o">?</span> <span class="s1">&#39;mouseenter&#39;</span> <span class="o">:</span> <span class="s1">&#39;focus&#39;</span></div><div class='line' id='LC58'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">eventOut</span> <span class="o">=</span> <span class="nx">trigger</span> <span class="o">==</span> <span class="s1">&#39;hover&#39;</span> <span class="o">?</span> <span class="s1">&#39;mouseleave&#39;</span> <span class="o">:</span> <span class="s1">&#39;blur&#39;</span></div><div class='line' id='LC59'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">$element</span><span class="p">.</span><span class="nx">on</span><span class="p">(</span><span class="nx">eventIn</span> <span class="o">+</span> <span class="s1">&#39;.&#39;</span> <span class="o">+</span> <span class="k">this</span><span class="p">.</span><span class="nx">type</span><span class="p">,</span> <span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">selector</span><span class="p">,</span> <span class="nx">$</span><span class="p">.</span><span class="nx">proxy</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">enter</span><span class="p">,</span> <span class="k">this</span><span class="p">))</span></div><div class='line' id='LC60'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">$element</span><span class="p">.</span><span class="nx">on</span><span class="p">(</span><span class="nx">eventOut</span> <span class="o">+</span> <span class="s1">&#39;.&#39;</span> <span class="o">+</span> <span class="k">this</span><span class="p">.</span><span class="nx">type</span><span class="p">,</span> <span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">selector</span><span class="p">,</span> <span class="nx">$</span><span class="p">.</span><span class="nx">proxy</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">leave</span><span class="p">,</span> <span class="k">this</span><span class="p">))</span></div><div class='line' id='LC61'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC62'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC63'><br/></div><div class='line' id='LC64'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">selector</span> <span class="o">?</span></div><div class='line' id='LC65'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">_options</span> <span class="o">=</span> <span class="nx">$</span><span class="p">.</span><span class="nx">extend</span><span class="p">({},</span> <span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">,</span> <span class="p">{</span> <span class="nx">trigger</span><span class="o">:</span> <span class="s1">&#39;manual&#39;</span><span class="p">,</span> <span class="nx">selector</span><span class="o">:</span> <span class="s1">&#39;&#39;</span> <span class="p">}))</span> <span class="o">:</span></div><div class='line' id='LC66'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">fixTitle</span><span class="p">()</span></div><div class='line' id='LC67'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC68'><br/></div><div class='line' id='LC69'>&nbsp;&nbsp;<span class="p">,</span> <span class="nx">getOptions</span><span class="o">:</span> <span class="kd">function</span> <span class="p">(</span><span class="nx">options</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC70'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">options</span> <span class="o">=</span> <span class="nx">$</span><span class="p">.</span><span class="nx">extend</span><span class="p">({},</span> <span class="nx">$</span><span class="p">.</span><span class="nx">fn</span><span class="p">[</span><span class="k">this</span><span class="p">.</span><span class="nx">type</span><span class="p">].</span><span class="nx">defaults</span><span class="p">,</span> <span class="k">this</span><span class="p">.</span><span class="nx">$element</span><span class="p">.</span><span class="nx">data</span><span class="p">(),</span> <span class="nx">options</span><span class="p">)</span></div><div class='line' id='LC71'><br/></div><div class='line' id='LC72'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">options</span><span class="p">.</span><span class="nx">delay</span> <span class="o">&amp;&amp;</span> <span class="k">typeof</span> <span class="nx">options</span><span class="p">.</span><span class="nx">delay</span> <span class="o">==</span> <span class="s1">&#39;number&#39;</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC73'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">options</span><span class="p">.</span><span class="nx">delay</span> <span class="o">=</span> <span class="p">{</span></div><div class='line' id='LC74'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">show</span><span class="o">:</span> <span class="nx">options</span><span class="p">.</span><span class="nx">delay</span></div><div class='line' id='LC75'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">,</span> <span class="nx">hide</span><span class="o">:</span> <span class="nx">options</span><span class="p">.</span><span class="nx">delay</span></div><div class='line' id='LC76'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC77'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC78'><br/></div><div class='line' id='LC79'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">options</span></div><div class='line' id='LC80'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC81'><br/></div><div class='line' id='LC82'>&nbsp;&nbsp;<span class="p">,</span> <span class="nx">enter</span><span class="o">:</span> <span class="kd">function</span> <span class="p">(</span><span class="nx">e</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC83'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">defaults</span> <span class="o">=</span> <span class="nx">$</span><span class="p">.</span><span class="nx">fn</span><span class="p">[</span><span class="k">this</span><span class="p">.</span><span class="nx">type</span><span class="p">].</span><span class="nx">defaults</span></div><div class='line' id='LC84'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">,</span> <span class="nx">options</span> <span class="o">=</span> <span class="p">{}</span></div><div class='line' id='LC85'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">,</span> <span class="nx">self</span></div><div class='line' id='LC86'><br/></div><div class='line' id='LC87'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">_options</span> <span class="o">&amp;&amp;</span> <span class="nx">$</span><span class="p">.</span><span class="nx">each</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">_options</span><span class="p">,</span> <span class="kd">function</span> <span class="p">(</span><span class="nx">key</span><span class="p">,</span> <span class="nx">value</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC88'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">defaults</span><span class="p">[</span><span class="nx">key</span><span class="p">]</span> <span class="o">!=</span> <span class="nx">value</span><span class="p">)</span> <span class="nx">options</span><span class="p">[</span><span class="nx">key</span><span class="p">]</span> <span class="o">=</span> <span class="nx">value</span></div><div class='line' id='LC89'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span> <span class="k">this</span><span class="p">)</span></div><div class='line' id='LC90'><br/></div><div class='line' id='LC91'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">self</span> <span class="o">=</span> <span class="nx">$</span><span class="p">(</span><span class="nx">e</span><span class="p">.</span><span class="nx">currentTarget</span><span class="p">)[</span><span class="k">this</span><span class="p">.</span><span class="nx">type</span><span class="p">](</span><span class="nx">options</span><span class="p">).</span><span class="nx">data</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">type</span><span class="p">)</span></div><div class='line' id='LC92'><br/></div><div class='line' id='LC93'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">self</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">delay</span> <span class="o">||</span> <span class="o">!</span><span class="nx">self</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">delay</span><span class="p">.</span><span class="nx">show</span><span class="p">)</span> <span class="k">return</span> <span class="nx">self</span><span class="p">.</span><span class="nx">show</span><span class="p">()</span></div><div class='line' id='LC94'><br/></div><div class='line' id='LC95'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">clearTimeout</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">timeout</span><span class="p">)</span></div><div class='line' id='LC96'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">self</span><span class="p">.</span><span class="nx">hoverState</span> <span class="o">=</span> <span class="s1">&#39;in&#39;</span></div><div class='line' id='LC97'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">timeout</span> <span class="o">=</span> <span class="nx">setTimeout</span><span class="p">(</span><span class="kd">function</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC98'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">self</span><span class="p">.</span><span class="nx">hoverState</span> <span class="o">==</span> <span class="s1">&#39;in&#39;</span><span class="p">)</span> <span class="nx">self</span><span class="p">.</span><span class="nx">show</span><span class="p">()</span></div><div class='line' id='LC99'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span> <span class="nx">self</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">delay</span><span class="p">.</span><span class="nx">show</span><span class="p">)</span></div><div class='line' id='LC100'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC101'><br/></div><div class='line' id='LC102'>&nbsp;&nbsp;<span class="p">,</span> <span class="nx">leave</span><span class="o">:</span> <span class="kd">function</span> <span class="p">(</span><span class="nx">e</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC103'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">self</span> <span class="o">=</span> <span class="nx">$</span><span class="p">(</span><span class="nx">e</span><span class="p">.</span><span class="nx">currentTarget</span><span class="p">)[</span><span class="k">this</span><span class="p">.</span><span class="nx">type</span><span class="p">](</span><span class="k">this</span><span class="p">.</span><span class="nx">_options</span><span class="p">).</span><span class="nx">data</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">type</span><span class="p">)</span></div><div class='line' id='LC104'><br/></div><div class='line' id='LC105'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">timeout</span><span class="p">)</span> <span class="nx">clearTimeout</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">timeout</span><span class="p">)</span></div><div class='line' id='LC106'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">self</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">delay</span> <span class="o">||</span> <span class="o">!</span><span class="nx">self</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">delay</span><span class="p">.</span><span class="nx">hide</span><span class="p">)</span> <span class="k">return</span> <span class="nx">self</span><span class="p">.</span><span class="nx">hide</span><span class="p">()</span></div><div class='line' id='LC107'><br/></div><div class='line' id='LC108'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">self</span><span class="p">.</span><span class="nx">hoverState</span> <span class="o">=</span> <span class="s1">&#39;out&#39;</span></div><div class='line' id='LC109'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">timeout</span> <span class="o">=</span> <span class="nx">setTimeout</span><span class="p">(</span><span class="kd">function</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC110'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">self</span><span class="p">.</span><span class="nx">hoverState</span> <span class="o">==</span> <span class="s1">&#39;out&#39;</span><span class="p">)</span> <span class="nx">self</span><span class="p">.</span><span class="nx">hide</span><span class="p">()</span></div><div class='line' id='LC111'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span> <span class="nx">self</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">delay</span><span class="p">.</span><span class="nx">hide</span><span class="p">)</span></div><div class='line' id='LC112'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC113'><br/></div><div class='line' id='LC114'>&nbsp;&nbsp;<span class="p">,</span> <span class="nx">show</span><span class="o">:</span> <span class="kd">function</span> <span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC115'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">$tip</span></div><div class='line' id='LC116'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">,</span> <span class="nx">pos</span></div><div class='line' id='LC117'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">,</span> <span class="nx">actualWidth</span></div><div class='line' id='LC118'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">,</span> <span class="nx">actualHeight</span></div><div class='line' id='LC119'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">,</span> <span class="nx">placement</span></div><div class='line' id='LC120'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">,</span> <span class="nx">tp</span></div><div class='line' id='LC121'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">,</span> <span class="nx">e</span> <span class="o">=</span> <span class="nx">$</span><span class="p">.</span><span class="nx">Event</span><span class="p">(</span><span class="s1">&#39;show&#39;</span><span class="p">)</span></div><div class='line' id='LC122'><br/></div><div class='line' id='LC123'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">hasContent</span><span class="p">()</span> <span class="o">&amp;&amp;</span> <span class="k">this</span><span class="p">.</span><span class="nx">enabled</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC124'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">$element</span><span class="p">.</span><span class="nx">trigger</span><span class="p">(</span><span class="nx">e</span><span class="p">)</span></div><div class='line' id='LC125'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">e</span><span class="p">.</span><span class="nx">isDefaultPrevented</span><span class="p">())</span> <span class="k">return</span></div><div class='line' id='LC126'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">$tip</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">tip</span><span class="p">()</span></div><div class='line' id='LC127'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">setContent</span><span class="p">()</span></div><div class='line' id='LC128'><br/></div><div class='line' id='LC129'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">animation</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC130'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">$tip</span><span class="p">.</span><span class="nx">addClass</span><span class="p">(</span><span class="s1">&#39;fade&#39;</span><span class="p">)</span></div><div class='line' id='LC131'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC132'><br/></div><div class='line' id='LC133'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">placement</span> <span class="o">=</span> <span class="k">typeof</span> <span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">placement</span> <span class="o">==</span> <span class="s1">&#39;function&#39;</span> <span class="o">?</span></div><div class='line' id='LC134'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">placement</span><span class="p">.</span><span class="nx">call</span><span class="p">(</span><span class="k">this</span><span class="p">,</span> <span class="nx">$tip</span><span class="p">[</span><span class="mi">0</span><span class="p">],</span> <span class="k">this</span><span class="p">.</span><span class="nx">$element</span><span class="p">[</span><span class="mi">0</span><span class="p">])</span> <span class="o">:</span></div><div class='line' id='LC135'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">placement</span></div><div class='line' id='LC136'><br/></div><div class='line' id='LC137'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">$tip</span></div><div class='line' id='LC138'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">.</span><span class="nx">detach</span><span class="p">()</span></div><div class='line' id='LC139'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">.</span><span class="nx">css</span><span class="p">({</span> <span class="nx">top</span><span class="o">:</span> <span class="mi">0</span><span class="p">,</span> <span class="nx">left</span><span class="o">:</span> <span class="mi">0</span><span class="p">,</span> <span class="nx">display</span><span class="o">:</span> <span class="s1">&#39;block&#39;</span> <span class="p">})</span></div><div class='line' id='LC140'><br/></div><div class='line' id='LC141'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">container</span> <span class="o">?</span> <span class="nx">$tip</span><span class="p">.</span><span class="nx">appendTo</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">container</span><span class="p">)</span> <span class="o">:</span> <span class="nx">$tip</span><span class="p">.</span><span class="nx">insertAfter</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">$element</span><span class="p">)</span></div><div class='line' id='LC142'><br/></div><div class='line' id='LC143'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">pos</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">getPosition</span><span class="p">()</span></div><div class='line' id='LC144'><br/></div><div class='line' id='LC145'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">actualWidth</span> <span class="o">=</span> <span class="nx">$tip</span><span class="p">[</span><span class="mi">0</span><span class="p">].</span><span class="nx">offsetWidth</span></div><div class='line' id='LC146'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">actualHeight</span> <span class="o">=</span> <span class="nx">$tip</span><span class="p">[</span><span class="mi">0</span><span class="p">].</span><span class="nx">offsetHeight</span></div><div class='line' id='LC147'><br/></div><div class='line' id='LC148'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">switch</span> <span class="p">(</span><span class="nx">placement</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC149'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">case</span> <span class="s1">&#39;bottom&#39;</span><span class="o">:</span></div><div class='line' id='LC150'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">tp</span> <span class="o">=</span> <span class="p">{</span><span class="nx">top</span><span class="o">:</span> <span class="nx">pos</span><span class="p">.</span><span class="nx">top</span> <span class="o">+</span> <span class="nx">pos</span><span class="p">.</span><span class="nx">height</span><span class="p">,</span> <span class="nx">left</span><span class="o">:</span> <span class="nx">pos</span><span class="p">.</span><span class="nx">left</span> <span class="o">+</span> <span class="nx">pos</span><span class="p">.</span><span class="nx">width</span> <span class="o">/</span> <span class="mi">2</span> <span class="o">-</span> <span class="nx">actualWidth</span> <span class="o">/</span> <span class="mi">2</span><span class="p">}</span></div><div class='line' id='LC151'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">break</span></div><div class='line' id='LC152'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">case</span> <span class="s1">&#39;top&#39;</span><span class="o">:</span></div><div class='line' id='LC153'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">tp</span> <span class="o">=</span> <span class="p">{</span><span class="nx">top</span><span class="o">:</span> <span class="nx">pos</span><span class="p">.</span><span class="nx">top</span> <span class="o">-</span> <span class="nx">actualHeight</span><span class="p">,</span> <span class="nx">left</span><span class="o">:</span> <span class="nx">pos</span><span class="p">.</span><span class="nx">left</span> <span class="o">+</span> <span class="nx">pos</span><span class="p">.</span><span class="nx">width</span> <span class="o">/</span> <span class="mi">2</span> <span class="o">-</span> <span class="nx">actualWidth</span> <span class="o">/</span> <span class="mi">2</span><span class="p">}</span></div><div class='line' id='LC154'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">break</span></div><div class='line' id='LC155'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">case</span> <span class="s1">&#39;left&#39;</span><span class="o">:</span></div><div class='line' id='LC156'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">tp</span> <span class="o">=</span> <span class="p">{</span><span class="nx">top</span><span class="o">:</span> <span class="nx">pos</span><span class="p">.</span><span class="nx">top</span> <span class="o">+</span> <span class="nx">pos</span><span class="p">.</span><span class="nx">height</span> <span class="o">/</span> <span class="mi">2</span> <span class="o">-</span> <span class="nx">actualHeight</span> <span class="o">/</span> <span class="mi">2</span><span class="p">,</span> <span class="nx">left</span><span class="o">:</span> <span class="nx">pos</span><span class="p">.</span><span class="nx">left</span> <span class="o">-</span> <span class="nx">actualWidth</span><span class="p">}</span></div><div class='line' id='LC157'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">break</span></div><div class='line' id='LC158'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">case</span> <span class="s1">&#39;right&#39;</span><span class="o">:</span></div><div class='line' id='LC159'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">tp</span> <span class="o">=</span> <span class="p">{</span><span class="nx">top</span><span class="o">:</span> <span class="nx">pos</span><span class="p">.</span><span class="nx">top</span> <span class="o">+</span> <span class="nx">pos</span><span class="p">.</span><span class="nx">height</span> <span class="o">/</span> <span class="mi">2</span> <span class="o">-</span> <span class="nx">actualHeight</span> <span class="o">/</span> <span class="mi">2</span><span class="p">,</span> <span class="nx">left</span><span class="o">:</span> <span class="nx">pos</span><span class="p">.</span><span class="nx">left</span> <span class="o">+</span> <span class="nx">pos</span><span class="p">.</span><span class="nx">width</span><span class="p">}</span></div><div class='line' id='LC160'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">break</span></div><div class='line' id='LC161'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC162'><br/></div><div class='line' id='LC163'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">applyPlacement</span><span class="p">(</span><span class="nx">tp</span><span class="p">,</span> <span class="nx">placement</span><span class="p">)</span></div><div class='line' id='LC164'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">$element</span><span class="p">.</span><span class="nx">trigger</span><span class="p">(</span><span class="s1">&#39;shown&#39;</span><span class="p">)</span></div><div class='line' id='LC165'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC166'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC167'><br/></div><div class='line' id='LC168'>&nbsp;&nbsp;<span class="p">,</span> <span class="nx">applyPlacement</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">offset</span><span class="p">,</span> <span class="nx">placement</span><span class="p">){</span></div><div class='line' id='LC169'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">$tip</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">tip</span><span class="p">()</span></div><div class='line' id='LC170'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">,</span> <span class="nx">width</span> <span class="o">=</span> <span class="nx">$tip</span><span class="p">[</span><span class="mi">0</span><span class="p">].</span><span class="nx">offsetWidth</span></div><div class='line' id='LC171'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">,</span> <span class="nx">height</span> <span class="o">=</span> <span class="nx">$tip</span><span class="p">[</span><span class="mi">0</span><span class="p">].</span><span class="nx">offsetHeight</span></div><div class='line' id='LC172'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">,</span> <span class="nx">actualWidth</span></div><div class='line' id='LC173'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">,</span> <span class="nx">actualHeight</span></div><div class='line' id='LC174'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">,</span> <span class="nx">delta</span></div><div class='line' id='LC175'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">,</span> <span class="nx">replace</span></div><div class='line' id='LC176'><br/></div><div class='line' id='LC177'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">$tip</span></div><div class='line' id='LC178'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">.</span><span class="nx">offset</span><span class="p">(</span><span class="nx">offset</span><span class="p">)</span></div><div class='line' id='LC179'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">.</span><span class="nx">addClass</span><span class="p">(</span><span class="nx">placement</span><span class="p">)</span></div><div class='line' id='LC180'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">.</span><span class="nx">addClass</span><span class="p">(</span><span class="s1">&#39;in&#39;</span><span class="p">)</span></div><div class='line' id='LC181'><br/></div><div class='line' id='LC182'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">actualWidth</span> <span class="o">=</span> <span class="nx">$tip</span><span class="p">[</span><span class="mi">0</span><span class="p">].</span><span class="nx">offsetWidth</span></div><div class='line' id='LC183'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">actualHeight</span> <span class="o">=</span> <span class="nx">$tip</span><span class="p">[</span><span class="mi">0</span><span class="p">].</span><span class="nx">offsetHeight</span></div><div class='line' id='LC184'><br/></div><div class='line' id='LC185'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">placement</span> <span class="o">==</span> <span class="s1">&#39;top&#39;</span> <span class="o">&amp;&amp;</span> <span class="nx">actualHeight</span> <span class="o">!=</span> <span class="nx">height</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC186'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">offset</span><span class="p">.</span><span class="nx">top</span> <span class="o">=</span> <span class="nx">offset</span><span class="p">.</span><span class="nx">top</span> <span class="o">+</span> <span class="nx">height</span> <span class="o">-</span> <span class="nx">actualHeight</span></div><div class='line' id='LC187'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">replace</span> <span class="o">=</span> <span class="kc">true</span></div><div class='line' id='LC188'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC189'><br/></div><div class='line' id='LC190'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">placement</span> <span class="o">==</span> <span class="s1">&#39;bottom&#39;</span> <span class="o">||</span> <span class="nx">placement</span> <span class="o">==</span> <span class="s1">&#39;top&#39;</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC191'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">delta</span> <span class="o">=</span> <span class="mi">0</span></div><div class='line' id='LC192'><br/></div><div class='line' id='LC193'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">offset</span><span class="p">.</span><span class="nx">left</span> <span class="o">&lt;</span> <span class="mi">0</span><span class="p">){</span></div><div class='line' id='LC194'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">delta</span> <span class="o">=</span> <span class="nx">offset</span><span class="p">.</span><span class="nx">left</span> <span class="o">*</span> <span class="o">-</span><span class="mi">2</span></div><div class='line' id='LC195'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">offset</span><span class="p">.</span><span class="nx">left</span> <span class="o">=</span> <span class="mi">0</span></div><div class='line' id='LC196'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">$tip</span><span class="p">.</span><span class="nx">offset</span><span class="p">(</span><span class="nx">offset</span><span class="p">)</span></div><div class='line' id='LC197'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">actualWidth</span> <span class="o">=</span> <span class="nx">$tip</span><span class="p">[</span><span class="mi">0</span><span class="p">].</span><span class="nx">offsetWidth</span></div><div class='line' id='LC198'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">actualHeight</span> <span class="o">=</span> <span class="nx">$tip</span><span class="p">[</span><span class="mi">0</span><span class="p">].</span><span class="nx">offsetHeight</span></div><div class='line' id='LC199'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC200'><br/></div><div class='line' id='LC201'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">replaceArrow</span><span class="p">(</span><span class="nx">delta</span> <span class="o">-</span> <span class="nx">width</span> <span class="o">+</span> <span class="nx">actualWidth</span><span class="p">,</span> <span class="nx">actualWidth</span><span class="p">,</span> <span class="s1">&#39;left&#39;</span><span class="p">)</span></div><div class='line' id='LC202'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC203'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">replaceArrow</span><span class="p">(</span><span class="nx">actualHeight</span> <span class="o">-</span> <span class="nx">height</span><span class="p">,</span> <span class="nx">actualHeight</span><span class="p">,</span> <span class="s1">&#39;top&#39;</span><span class="p">)</span></div><div class='line' id='LC204'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC205'><br/></div><div class='line' id='LC206'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">replace</span><span class="p">)</span> <span class="nx">$tip</span><span class="p">.</span><span class="nx">offset</span><span class="p">(</span><span class="nx">offset</span><span class="p">)</span></div><div class='line' id='LC207'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC208'><br/></div><div class='line' id='LC209'>&nbsp;&nbsp;<span class="p">,</span> <span class="nx">replaceArrow</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">delta</span><span class="p">,</span> <span class="nx">dimension</span><span class="p">,</span> <span class="nx">position</span><span class="p">){</span></div><div class='line' id='LC210'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span></div><div class='line' id='LC211'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">.</span><span class="nx">arrow</span><span class="p">()</span></div><div class='line' id='LC212'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">.</span><span class="nx">css</span><span class="p">(</span><span class="nx">position</span><span class="p">,</span> <span class="nx">delta</span> <span class="o">?</span> <span class="p">(</span><span class="mi">50</span> <span class="o">*</span> <span class="p">(</span><span class="mi">1</span> <span class="o">-</span> <span class="nx">delta</span> <span class="o">/</span> <span class="nx">dimension</span><span class="p">)</span> <span class="o">+</span> <span class="s2">&quot;%&quot;</span><span class="p">)</span> <span class="o">:</span> <span class="s1">&#39;&#39;</span><span class="p">)</span></div><div class='line' id='LC213'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC214'><br/></div><div class='line' id='LC215'>&nbsp;&nbsp;<span class="p">,</span> <span class="nx">setContent</span><span class="o">:</span> <span class="kd">function</span> <span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC216'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">$tip</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">tip</span><span class="p">()</span></div><div class='line' id='LC217'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">,</span> <span class="nx">title</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">getTitle</span><span class="p">()</span></div><div class='line' id='LC218'><br/></div><div class='line' id='LC219'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">$tip</span><span class="p">.</span><span class="nx">find</span><span class="p">(</span><span class="s1">&#39;.tooltip-inner&#39;</span><span class="p">)[</span><span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">html</span> <span class="o">?</span> <span class="s1">&#39;html&#39;</span> <span class="o">:</span> <span class="s1">&#39;text&#39;</span><span class="p">](</span><span class="nx">title</span><span class="p">)</span></div><div class='line' id='LC220'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">$tip</span><span class="p">.</span><span class="nx">removeClass</span><span class="p">(</span><span class="s1">&#39;fade in top bottom left right&#39;</span><span class="p">)</span></div><div class='line' id='LC221'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC222'><br/></div><div class='line' id='LC223'>&nbsp;&nbsp;<span class="p">,</span> <span class="nx">hide</span><span class="o">:</span> <span class="kd">function</span> <span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC224'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">that</span> <span class="o">=</span> <span class="k">this</span></div><div class='line' id='LC225'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">,</span> <span class="nx">$tip</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">tip</span><span class="p">()</span></div><div class='line' id='LC226'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">,</span> <span class="nx">e</span> <span class="o">=</span> <span class="nx">$</span><span class="p">.</span><span class="nx">Event</span><span class="p">(</span><span class="s1">&#39;hide&#39;</span><span class="p">)</span></div><div class='line' id='LC227'><br/></div><div class='line' id='LC228'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">$element</span><span class="p">.</span><span class="nx">trigger</span><span class="p">(</span><span class="nx">e</span><span class="p">)</span></div><div class='line' id='LC229'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">e</span><span class="p">.</span><span class="nx">isDefaultPrevented</span><span class="p">())</span> <span class="k">return</span></div><div class='line' id='LC230'><br/></div><div class='line' id='LC231'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">$tip</span><span class="p">.</span><span class="nx">removeClass</span><span class="p">(</span><span class="s1">&#39;in&#39;</span><span class="p">)</span></div><div class='line' id='LC232'><br/></div><div class='line' id='LC233'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">function</span> <span class="nx">removeWithAnimation</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC234'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">timeout</span> <span class="o">=</span> <span class="nx">setTimeout</span><span class="p">(</span><span class="kd">function</span> <span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC235'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">$tip</span><span class="p">.</span><span class="nx">off</span><span class="p">(</span><span class="nx">$</span><span class="p">.</span><span class="nx">support</span><span class="p">.</span><span class="nx">transition</span><span class="p">.</span><span class="nx">end</span><span class="p">).</span><span class="nx">detach</span><span class="p">()</span></div><div class='line' id='LC236'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span> <span class="mi">500</span><span class="p">)</span></div><div class='line' id='LC237'><br/></div><div class='line' id='LC238'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">$tip</span><span class="p">.</span><span class="nx">one</span><span class="p">(</span><span class="nx">$</span><span class="p">.</span><span class="nx">support</span><span class="p">.</span><span class="nx">transition</span><span class="p">.</span><span class="nx">end</span><span class="p">,</span> <span class="kd">function</span> <span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC239'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">clearTimeout</span><span class="p">(</span><span class="nx">timeout</span><span class="p">)</span></div><div class='line' id='LC240'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">$tip</span><span class="p">.</span><span class="nx">detach</span><span class="p">()</span></div><div class='line' id='LC241'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">})</span></div><div class='line' id='LC242'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC243'><br/></div><div class='line' id='LC244'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">$</span><span class="p">.</span><span class="nx">support</span><span class="p">.</span><span class="nx">transition</span> <span class="o">&amp;&amp;</span> <span class="k">this</span><span class="p">.</span><span class="nx">$tip</span><span class="p">.</span><span class="nx">hasClass</span><span class="p">(</span><span class="s1">&#39;fade&#39;</span><span class="p">)</span> <span class="o">?</span></div><div class='line' id='LC245'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">removeWithAnimation</span><span class="p">()</span> <span class="o">:</span></div><div class='line' id='LC246'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">$tip</span><span class="p">.</span><span class="nx">detach</span><span class="p">()</span></div><div class='line' id='LC247'><br/></div><div class='line' id='LC248'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">$element</span><span class="p">.</span><span class="nx">trigger</span><span class="p">(</span><span class="s1">&#39;hidden&#39;</span><span class="p">)</span></div><div class='line' id='LC249'><br/></div><div class='line' id='LC250'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="k">this</span></div><div class='line' id='LC251'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC252'><br/></div><div class='line' id='LC253'>&nbsp;&nbsp;<span class="p">,</span> <span class="nx">fixTitle</span><span class="o">:</span> <span class="kd">function</span> <span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC254'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">$e</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">$element</span></div><div class='line' id='LC255'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">$e</span><span class="p">.</span><span class="nx">attr</span><span class="p">(</span><span class="s1">&#39;title&#39;</span><span class="p">)</span> <span class="o">||</span> <span class="k">typeof</span><span class="p">(</span><span class="nx">$e</span><span class="p">.</span><span class="nx">attr</span><span class="p">(</span><span class="s1">&#39;data-original-title&#39;</span><span class="p">))</span> <span class="o">!=</span> <span class="s1">&#39;string&#39;</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC256'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">$e</span><span class="p">.</span><span class="nx">attr</span><span class="p">(</span><span class="s1">&#39;data-original-title&#39;</span><span class="p">,</span> <span class="nx">$e</span><span class="p">.</span><span class="nx">attr</span><span class="p">(</span><span class="s1">&#39;title&#39;</span><span class="p">)</span> <span class="o">||</span> <span class="s1">&#39;&#39;</span><span class="p">).</span><span class="nx">attr</span><span class="p">(</span><span class="s1">&#39;title&#39;</span><span class="p">,</span> <span class="s1">&#39;&#39;</span><span class="p">)</span></div><div class='line' id='LC257'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC258'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC259'><br/></div><div class='line' id='LC260'>&nbsp;&nbsp;<span class="p">,</span> <span class="nx">hasContent</span><span class="o">:</span> <span class="kd">function</span> <span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC261'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="k">this</span><span class="p">.</span><span class="nx">getTitle</span><span class="p">()</span></div><div class='line' id='LC262'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC263'><br/></div><div class='line' id='LC264'>&nbsp;&nbsp;<span class="p">,</span> <span class="nx">getPosition</span><span class="o">:</span> <span class="kd">function</span> <span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC265'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">el</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">$element</span><span class="p">[</span><span class="mi">0</span><span class="p">]</span></div><div class='line' id='LC266'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">$</span><span class="p">.</span><span class="nx">extend</span><span class="p">({},</span> <span class="p">(</span><span class="k">typeof</span> <span class="nx">el</span><span class="p">.</span><span class="nx">getBoundingClientRect</span> <span class="o">==</span> <span class="s1">&#39;function&#39;</span><span class="p">)</span> <span class="o">?</span> <span class="nx">el</span><span class="p">.</span><span class="nx">getBoundingClientRect</span><span class="p">()</span> <span class="o">:</span> <span class="p">{</span></div><div class='line' id='LC267'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">width</span><span class="o">:</span> <span class="nx">el</span><span class="p">.</span><span class="nx">offsetWidth</span></div><div class='line' id='LC268'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">,</span> <span class="nx">height</span><span class="o">:</span> <span class="nx">el</span><span class="p">.</span><span class="nx">offsetHeight</span></div><div class='line' id='LC269'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span> <span class="k">this</span><span class="p">.</span><span class="nx">$element</span><span class="p">.</span><span class="nx">offset</span><span class="p">())</span></div><div class='line' id='LC270'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC271'><br/></div><div class='line' id='LC272'>&nbsp;&nbsp;<span class="p">,</span> <span class="nx">getTitle</span><span class="o">:</span> <span class="kd">function</span> <span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC273'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">title</span></div><div class='line' id='LC274'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">,</span> <span class="nx">$e</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">$element</span></div><div class='line' id='LC275'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">,</span> <span class="nx">o</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">options</span></div><div class='line' id='LC276'><br/></div><div class='line' id='LC277'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">title</span> <span class="o">=</span> <span class="nx">$e</span><span class="p">.</span><span class="nx">attr</span><span class="p">(</span><span class="s1">&#39;data-original-title&#39;</span><span class="p">)</span></div><div class='line' id='LC278'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="o">||</span> <span class="p">(</span><span class="k">typeof</span> <span class="nx">o</span><span class="p">.</span><span class="nx">title</span> <span class="o">==</span> <span class="s1">&#39;function&#39;</span> <span class="o">?</span> <span class="nx">o</span><span class="p">.</span><span class="nx">title</span><span class="p">.</span><span class="nx">call</span><span class="p">(</span><span class="nx">$e</span><span class="p">[</span><span class="mi">0</span><span class="p">])</span> <span class="o">:</span>  <span class="nx">o</span><span class="p">.</span><span class="nx">title</span><span class="p">)</span></div><div class='line' id='LC279'><br/></div><div class='line' id='LC280'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">title</span></div><div class='line' id='LC281'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC282'><br/></div><div class='line' id='LC283'>&nbsp;&nbsp;<span class="p">,</span> <span class="nx">tip</span><span class="o">:</span> <span class="kd">function</span> <span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC284'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="k">this</span><span class="p">.</span><span class="nx">$tip</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">$tip</span> <span class="o">||</span> <span class="nx">$</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">template</span><span class="p">)</span></div><div class='line' id='LC285'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC286'><br/></div><div class='line' id='LC287'>&nbsp;&nbsp;<span class="p">,</span> <span class="nx">arrow</span><span class="o">:</span> <span class="kd">function</span><span class="p">(){</span></div><div class='line' id='LC288'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="k">this</span><span class="p">.</span><span class="nx">$arrow</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">$arrow</span> <span class="o">||</span> <span class="k">this</span><span class="p">.</span><span class="nx">tip</span><span class="p">().</span><span class="nx">find</span><span class="p">(</span><span class="s2">&quot;.tooltip-arrow&quot;</span><span class="p">)</span></div><div class='line' id='LC289'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC290'><br/></div><div class='line' id='LC291'>&nbsp;&nbsp;<span class="p">,</span> <span class="nx">validate</span><span class="o">:</span> <span class="kd">function</span> <span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC292'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="k">this</span><span class="p">.</span><span class="nx">$element</span><span class="p">[</span><span class="mi">0</span><span class="p">].</span><span class="nx">parentNode</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC293'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">hide</span><span class="p">()</span></div><div class='line' id='LC294'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">$element</span> <span class="o">=</span> <span class="kc">null</span></div><div class='line' id='LC295'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">options</span> <span class="o">=</span> <span class="kc">null</span></div><div class='line' id='LC296'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC297'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC298'><br/></div><div class='line' id='LC299'>&nbsp;&nbsp;<span class="p">,</span> <span class="nx">enable</span><span class="o">:</span> <span class="kd">function</span> <span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC300'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">enabled</span> <span class="o">=</span> <span class="kc">true</span></div><div class='line' id='LC301'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC302'><br/></div><div class='line' id='LC303'>&nbsp;&nbsp;<span class="p">,</span> <span class="nx">disable</span><span class="o">:</span> <span class="kd">function</span> <span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC304'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">enabled</span> <span class="o">=</span> <span class="kc">false</span></div><div class='line' id='LC305'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC306'><br/></div><div class='line' id='LC307'>&nbsp;&nbsp;<span class="p">,</span> <span class="nx">toggleEnabled</span><span class="o">:</span> <span class="kd">function</span> <span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC308'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">enabled</span> <span class="o">=</span> <span class="o">!</span><span class="k">this</span><span class="p">.</span><span class="nx">enabled</span></div><div class='line' id='LC309'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC310'><br/></div><div class='line' id='LC311'>&nbsp;&nbsp;<span class="p">,</span> <span class="nx">toggle</span><span class="o">:</span> <span class="kd">function</span> <span class="p">(</span><span class="nx">e</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC312'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">self</span> <span class="o">=</span> <span class="nx">e</span> <span class="o">?</span> <span class="nx">$</span><span class="p">(</span><span class="nx">e</span><span class="p">.</span><span class="nx">currentTarget</span><span class="p">)[</span><span class="k">this</span><span class="p">.</span><span class="nx">type</span><span class="p">](</span><span class="k">this</span><span class="p">.</span><span class="nx">_options</span><span class="p">).</span><span class="nx">data</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">type</span><span class="p">)</span> <span class="o">:</span> <span class="k">this</span></div><div class='line' id='LC313'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">self</span><span class="p">.</span><span class="nx">tip</span><span class="p">().</span><span class="nx">hasClass</span><span class="p">(</span><span class="s1">&#39;in&#39;</span><span class="p">)</span> <span class="o">?</span> <span class="nx">self</span><span class="p">.</span><span class="nx">hide</span><span class="p">()</span> <span class="o">:</span> <span class="nx">self</span><span class="p">.</span><span class="nx">show</span><span class="p">()</span></div><div class='line' id='LC314'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC315'><br/></div><div class='line' id='LC316'>&nbsp;&nbsp;<span class="p">,</span> <span class="nx">destroy</span><span class="o">:</span> <span class="kd">function</span> <span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC317'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">hide</span><span class="p">().</span><span class="nx">$element</span><span class="p">.</span><span class="nx">off</span><span class="p">(</span><span class="s1">&#39;.&#39;</span> <span class="o">+</span> <span class="k">this</span><span class="p">.</span><span class="nx">type</span><span class="p">).</span><span class="nx">removeData</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">type</span><span class="p">)</span></div><div class='line' id='LC318'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC319'><br/></div><div class='line' id='LC320'>&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC321'><br/></div><div class='line' id='LC322'><br/></div><div class='line' id='LC323'>&nbsp;<span class="cm">/* TOOLTIP PLUGIN DEFINITION</span></div><div class='line' id='LC324'><span class="cm">  * ========================= */</span></div><div class='line' id='LC325'><br/></div><div class='line' id='LC326'>&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">old</span> <span class="o">=</span> <span class="nx">$</span><span class="p">.</span><span class="nx">fn</span><span class="p">.</span><span class="nx">tooltip</span></div><div class='line' id='LC327'><br/></div><div class='line' id='LC328'>&nbsp;&nbsp;<span class="nx">$</span><span class="p">.</span><span class="nx">fn</span><span class="p">.</span><span class="nx">tooltip</span> <span class="o">=</span> <span class="kd">function</span> <span class="p">(</span> <span class="nx">option</span> <span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC329'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="k">this</span><span class="p">.</span><span class="nx">each</span><span class="p">(</span><span class="kd">function</span> <span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC330'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">$this</span> <span class="o">=</span> <span class="nx">$</span><span class="p">(</span><span class="k">this</span><span class="p">)</span></div><div class='line' id='LC331'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">,</span> <span class="nx">data</span> <span class="o">=</span> <span class="nx">$this</span><span class="p">.</span><span class="nx">data</span><span class="p">(</span><span class="s1">&#39;tooltip&#39;</span><span class="p">)</span></div><div class='line' id='LC332'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">,</span> <span class="nx">options</span> <span class="o">=</span> <span class="k">typeof</span> <span class="nx">option</span> <span class="o">==</span> <span class="s1">&#39;object&#39;</span> <span class="o">&amp;&amp;</span> <span class="nx">option</span></div><div class='line' id='LC333'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">data</span><span class="p">)</span> <span class="nx">$this</span><span class="p">.</span><span class="nx">data</span><span class="p">(</span><span class="s1">&#39;tooltip&#39;</span><span class="p">,</span> <span class="p">(</span><span class="nx">data</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">Tooltip</span><span class="p">(</span><span class="k">this</span><span class="p">,</span> <span class="nx">options</span><span class="p">)))</span></div><div class='line' id='LC334'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">typeof</span> <span class="nx">option</span> <span class="o">==</span> <span class="s1">&#39;string&#39;</span><span class="p">)</span> <span class="nx">data</span><span class="p">[</span><span class="nx">option</span><span class="p">]()</span></div><div class='line' id='LC335'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">})</span></div><div class='line' id='LC336'>&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC337'><br/></div><div class='line' id='LC338'>&nbsp;&nbsp;<span class="nx">$</span><span class="p">.</span><span class="nx">fn</span><span class="p">.</span><span class="nx">tooltip</span><span class="p">.</span><span class="nx">Constructor</span> <span class="o">=</span> <span class="nx">Tooltip</span></div><div class='line' id='LC339'><br/></div><div class='line' id='LC340'>&nbsp;&nbsp;<span class="nx">$</span><span class="p">.</span><span class="nx">fn</span><span class="p">.</span><span class="nx">tooltip</span><span class="p">.</span><span class="nx">defaults</span> <span class="o">=</span> <span class="p">{</span></div><div class='line' id='LC341'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">animation</span><span class="o">:</span> <span class="kc">true</span></div><div class='line' id='LC342'>&nbsp;&nbsp;<span class="p">,</span> <span class="nx">placement</span><span class="o">:</span> <span class="s1">&#39;top&#39;</span></div><div class='line' id='LC343'>&nbsp;&nbsp;<span class="p">,</span> <span class="nx">selector</span><span class="o">:</span> <span class="kc">false</span></div><div class='line' id='LC344'>&nbsp;&nbsp;<span class="p">,</span> <span class="nx">template</span><span class="o">:</span> <span class="s1">&#39;&lt;div class=&quot;tooltip&quot;&gt;&lt;div class=&quot;tooltip-arrow&quot;&gt;&lt;/div&gt;&lt;div class=&quot;tooltip-inner&quot;&gt;&lt;/div&gt;&lt;/div&gt;&#39;</span></div><div class='line' id='LC345'>&nbsp;&nbsp;<span class="p">,</span> <span class="nx">trigger</span><span class="o">:</span> <span class="s1">&#39;hover focus&#39;</span></div><div class='line' id='LC346'>&nbsp;&nbsp;<span class="p">,</span> <span class="nx">title</span><span class="o">:</span> <span class="s1">&#39;&#39;</span></div><div class='line' id='LC347'>&nbsp;&nbsp;<span class="p">,</span> <span class="nx">delay</span><span class="o">:</span> <span class="mi">0</span></div><div class='line' id='LC348'>&nbsp;&nbsp;<span class="p">,</span> <span class="nx">html</span><span class="o">:</span> <span class="kc">false</span></div><div class='line' id='LC349'>&nbsp;&nbsp;<span class="p">,</span> <span class="nx">container</span><span class="o">:</span> <span class="kc">false</span></div><div class='line' id='LC350'>&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC351'><br/></div><div class='line' id='LC352'><br/></div><div class='line' id='LC353'>&nbsp;<span class="cm">/* TOOLTIP NO CONFLICT</span></div><div class='line' id='LC354'><span class="cm">  * =================== */</span></div><div class='line' id='LC355'><br/></div><div class='line' id='LC356'>&nbsp;&nbsp;<span class="nx">$</span><span class="p">.</span><span class="nx">fn</span><span class="p">.</span><span class="nx">tooltip</span><span class="p">.</span><span class="nx">noConflict</span> <span class="o">=</span> <span class="kd">function</span> <span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC357'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">$</span><span class="p">.</span><span class="nx">fn</span><span class="p">.</span><span class="nx">tooltip</span> <span class="o">=</span> <span class="nx">old</span></div><div class='line' id='LC358'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="k">this</span></div><div class='line' id='LC359'>&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC360'><br/></div><div class='line' id='LC361'><span class="p">}(</span><span class="nb">window</span><span class="p">.</span><span class="nx">jQuery</span><span class="p">);</span></div></pre></div>
          </td>
        </tr>
      </table>
  </div>

          </div>
        </div>

        <a href="#jump-to-line" rel="facebox" data-hotkey="l" class="js-jump-to-line" style="display:none">Jump to Line</a>
        <div id="jump-to-line" style="display:none">
          <h2>Jump to Line</h2>
          <form accept-charset="UTF-8" class="js-jump-to-line-form">
            <input class="textfield js-jump-to-line-field" type="text">
            <div class="full-button">
              <button type="submit" class="button">Go</button>
            </div>
          </form>
        </div>

      </div>
    </div>
</div>

<div id="js-frame-loading-template" class="frame frame-loading large-loading-area" style="display:none;">
  <img class="js-frame-loading-spinner" src="https://a248.e.akamai.net/assets.github.com/images/spinners/octocat-spinner-128.gif?1347543529" height="64" width="64">
</div>


        </div>
      </div>
      <div class="modal-backdrop"></div>
    </div>

      <div id="footer-push"></div><!-- hack for sticky footer -->
    </div><!-- end of wrapper - hack for sticky footer -->

      <!-- footer -->
      <div id="footer">
  <div class="container clearfix">

      <dl class="footer_nav">
        <dt>GitHub</dt>
        <dd><a href="/about">About us</a></dd>
        <dd><a href="/blog">Blog</a></dd>
        <dd><a href="/contact">Contact &amp; support</a></dd>
        <dd><a href="http://enterprise.github.com/">GitHub Enterprise</a></dd>
        <dd><a href="http://status.github.com/">Site status</a></dd>
      </dl>

      <dl class="footer_nav">
        <dt>Applications</dt>
        <dd><a href="http://mac.github.com/">GitHub for Mac</a></dd>
        <dd><a href="http://windows.github.com/">GitHub for Windows</a></dd>
        <dd><a href="http://eclipse.github.com/">GitHub for Eclipse</a></dd>
        <dd><a href="http://mobile.github.com/">GitHub mobile apps</a></dd>
      </dl>

      <dl class="footer_nav">
        <dt>Services</dt>
        <dd><a href="http://get.gaug.es/">Gauges: Web analytics</a></dd>
        <dd><a href="http://speakerdeck.com">Speaker Deck: Presentations</a></dd>
        <dd><a href="https://gist.github.com">Gist: Code snippets</a></dd>
        <dd><a href="http://jobs.github.com/">Job board</a></dd>
      </dl>

      <dl class="footer_nav">
        <dt>Documentation</dt>
        <dd><a href="http://help.github.com/">GitHub Help</a></dd>
        <dd><a href="http://developer.github.com/">Developer API</a></dd>
        <dd><a href="http://github.github.com/github-flavored-markdown/">GitHub Flavored Markdown</a></dd>
        <dd><a href="http://pages.github.com/">GitHub Pages</a></dd>
      </dl>

      <dl class="footer_nav">
        <dt>More</dt>
        <dd><a href="http://training.github.com/">Training</a></dd>
        <dd><a href="/edu">Students &amp; teachers</a></dd>
        <dd><a href="http://shop.github.com">The Shop</a></dd>
        <dd><a href="/plans">Plans &amp; pricing</a></dd>
        <dd><a href="http://octodex.github.com/">The Octodex</a></dd>
      </dl>

      <hr class="footer-divider">


    <p class="right">&copy; 2013 <span title="0.09637s from fe13.rs.github.com">GitHub</span>, Inc. All rights reserved.</p>
    <a class="left" href="/">
      <span class="mega-octicon octicon-mark-github"></span>
    </a>
    <ul id="legal">
        <li><a href="/site/terms">Terms of Service</a></li>
        <li><a href="/site/privacy">Privacy</a></li>
        <li><a href="/security">Security</a></li>
    </ul>

  </div><!-- /.container -->

</div><!-- /.#footer -->


    <div class="fullscreen-overlay js-fullscreen-overlay" id="fullscreen_overlay">
  <div class="fullscreen-container js-fullscreen-container">
    <div class="textarea-wrap">
      <textarea name="fullscreen-contents" id="fullscreen-contents" class="js-fullscreen-contents" placeholder="" data-suggester="fullscreen_suggester"></textarea>
          <div class="suggester-container">
              <div class="suggester fullscreen-suggester js-navigation-container" id="fullscreen_suggester"
                 data-url="/twitter/bootstrap/suggestions/commit">
              </div>
          </div>
    </div>
  </div>
  <div class="fullscreen-sidebar">
    <a href="#" class="exit-fullscreen js-exit-fullscreen tooltipped leftwards" title="Exit Zen Mode">
      <span class="mega-octicon octicon-screen-normal"></span>
    </a>
    <a href="#" class="theme-switcher js-theme-switcher tooltipped leftwards"
      title="Switch themes">
      <span class="octicon octicon-color-mode"></span>
    </a>
  </div>
</div>



    <div id="ajax-error-message" class="flash flash-error">
      <span class="octicon octicon-alert"></span>
      Something went wrong with that request. Please try again.
      <a href="#" class="octicon octicon-remove-close ajax-error-dismiss"></a>
    </div>

    
    <span id='server_response_time' data-time='0.09687' data-host='fe13'></span>
    
  </body>
</html>

