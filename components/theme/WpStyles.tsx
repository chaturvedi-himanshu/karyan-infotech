/**
 * Mirrors WordPress enqueue order for TheRoof + Elementor (karyaninfratech.co.in).
 * Keeps typography, colors, and layout aligned with the live site.
 */
export default function WpStyles() {
  const base = "/wp";
  const sheets = [
    `${base}/bootstrap.min.css`,
    `${base}/swiper.min.css`,
    `${base}/fontawesome-all.min.css`,
    `${base}/elementor-frontend.min.css`,
    `${base}/post-8.css`,
    `${base}/elementor-global.css`,
    `${base}/widget-heading.min.css`,
    `${base}/widget-image.min.css`,
    `${base}/widget-image-box.min.css`,
    `${base}/theroof-add-ons.min.css`,
    `${base}/theroof-style.css`,
    `${base}/cf7-styles.css`,
    `${base}/post-9961.css`,
    `${base}/post-10024.css`,
    `${base}/post-8461.css`,
    `${base}/next-wp-tweaks.css`,
  ];
  return (
    <>
      {sheets.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      <style
        dangerouslySetInnerHTML={{
          __html: `
:root{
--themecolor:#655e56;
--theme-bg-deep:#242424;
--theme-bg:#313131;
--theme-bg-soft:#3a3a3a;
--theme-bg-muted:#454545;
--theme-bg-elevated:#525252;
--theme-fg:#222222;
--theme-fg-soft:#333333;
--theme-fg-muted:#5c5c5c;
--theme-fg-subtle:#767676;
--theme-on-bg:#e8e8e8;
--theme-on-bg-muted:#bdbdbd;
--theme-on-bg-subtle:#949494;
}
body{background-color:var(--theme-bg);color:var(--theme-on-bg)}
p{color:var(--theme-on-bg-muted)}
a{color:var(--theme-on-bg-subtle)}
a:hover{color:var(--theme-on-bg-muted)}
.gray-bg{background-color:var(--theme-bg-soft)}
.top-bar{background-color:var(--theme-bg);border-bottom:1px solid var(--theme-bg-soft)}
.header-inner{background-color:#f7f6f4}
.nav-holder nav li ul{background-color:var(--theme-bg-muted)}
.vismobmenu{background-color:var(--theme-bg-muted)}
.nav-holder nav li a{color:var(--theme-fg)}
.nav-holder nav li a:hover{color:rgba(101,94,86,1)}
.nav-holder nav li.current-menu-item>a,.nav-holder nav li.current-menu-ancestor>a,.nav-holder nav li.current-menu-parent>a{color:rgba(101,94,86,1)}
.nav-holder nav li ul a{color:#ffffff}
.nav-holder nav li ul a:hover{color:#a29c95}
.nav-holder nav li ul li.current-menu-item>a,.nav-holder nav li ul li.current-menu-ancestor>a,.nav-holder nav li ul li.current-menu-parent>a{color:#a29c95}
.menusb a{color:#ffffff}
.vismobmenu nav li.current-menu-item>a,.vismobmenu nav li.current-menu-ancestor>a,.vismobmenu nav li.current-menu-parent>a{color:#a29c95}
.sub-footer{display:none;}
`,
        }}
      />
    </>
  );
}
