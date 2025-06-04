const Home: React.FC = () => {
  return (
    <div>
      <div id="content-wrapper">
        <main>
          <div id="inner">
            <h2>記事ページ見出し・大</h2>
            <p>文章あれこれ</p>
            <h3>記事ページ見出し・中</h3>
            <p>文章あれこれ</p>
            <h4>記事ページ見出し・小</h4>
            <p>文章あれこれ</p>
          </div>
        </main>
        <aside>
          <div id="middle-inner">
            <div className="side-title">menu</div>
            <div className="side">
              <ul>
                <li>
                  <a href="/subpage/">JavaScript Tips</a>
                </li>
                <li>
                  <a href="/hooktestPage">hooktestPage</a>
                </li>
                <li>
                  <a href="/block/">テトリス</a>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Home;
