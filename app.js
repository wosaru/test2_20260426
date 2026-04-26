/*
  ==============================
  データ定義（data.json を直接埋め込み）
  ==============================
*/

const data = [
{ "src": "10001_設定1相当_非リセット時_短縮なし_0_不問_不問_不問.png","設定":"設定1相当","リセットの有無":"非リセット時","短縮の有無":"短縮なし","RBスルー回数":"0","前回ST終了時差枚数":"不問","前回ST出玉":"不問","前回ST当選ゾーン":"不問" },
{ "src": "10002_設定混合_非リセット時_短縮なし_0_不問_不問_不問.png","設定":"設定混合","リセットの有無":"非リセット時","短縮の有無":"短縮なし","RBスルー回数":"0","前回ST終了時差枚数":"不問","前回ST出玉":"不問","前回ST当選ゾーン":"不問" },
{ "src": "10003_設定1相当_非リセット時_短縮なし_1_不問_不問_不問.png","設定":"設定1相当","リセットの有無":"非リセット時","短縮の有無":"短縮なし","RBスルー回数":"1","前回ST終了時差枚数":"不問","前回ST出玉":"不問","前回ST当選ゾーン":"不問" },




];


/*
==============================
初期化
==============================
*/

const filtersDiv = document.getElementById("filters");
const galleryDiv = document.getElementById("gallery");

// src 以外を条件キーとして取得
const conditionKeys = Object.keys(data[0]).filter(key => key !== "src");

// select要素保持
const selects = {};


/*
==============================
お気に入りUI生成
==============================
*/

const favoriteBox = document.createElement("div");
favoriteBox.id = "favoriteBox";

favoriteBox.innerHTML = `
  <input id="favName" placeholder="お気に入り名">
  <button id="saveFav">保存</button>

  <select id="favList">
    <option value="">お気に入り選択</option>
  </select>

  <button id="loadFav">読込</button>
  <button id="deleteFav">削除</button>
`;

filtersDiv.appendChild(favoriteBox);


/*
==============================
条件UI生成
==============================
*/

conditionKeys.forEach(key => {
  const group = document.createElement("div");
  group.className = "filter-group";

  const label = document.createElement("label");
  label.textContent = key + "：";

  const select = document.createElement("select");

  const values = [...new Set(data.map(item => item[key]))];

  values.forEach(value => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });

  select.addEventListener("change", update);

  group.appendChild(label);
  group.appendChild(select);
  filtersDiv.appendChild(group);

  selects[key] = select;
});


/*
==============================
お気に入り機能
==============================
*/

const STORAGE_KEY =
  "imageFilterFavorites_" + location.pathname;

function getFavorites() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
}

function saveFavorites(obj) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

function refreshFavoriteList() {
  const favList = document.getElementById("favList");
  const favorites = getFavorites();

  favList.innerHTML =
    '<option value="">お気に入り選択</option>';

  Object.keys(favorites).forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    favList.appendChild(option);
  });
}

// 保存
document.getElementById("saveFav").onclick = () => {
  const name = document.getElementById("favName").value.trim();
  if (!name) {
    alert("名前を入力してください");
    return;
  }

  const favorites = getFavorites();

  const state = {};
  conditionKeys.forEach(key => {
    state[key] = selects[key].value;
  });

  favorites[name] = state;
  saveFavorites(favorites);
  refreshFavoriteList();

  alert("保存しました");
};

// 読込
document.getElementById("loadFav").onclick = () => {
  const name = document.getElementById("favList").value;
  if (!name) return;

  const favorites = getFavorites();
  const state = favorites[name];

  conditionKeys.forEach(key => {
    if (state[key]) {
      selects[key].value = state[key];
    }
  });

  update();
};

// 削除
document.getElementById("deleteFav").onclick = () => {
  const name = document.getElementById("favList").value;
  if (!name) return;

  if (!confirm("削除しますか？")) return;

  const favorites = getFavorites();
  delete favorites[name];

  saveFavorites(favorites);
  refreshFavoriteList();
};


/*
==============================
検索＆描画
==============================
*/

function update() {
  galleryDiv.innerHTML = "";

  const filtered = data.filter(item => {
    return conditionKeys.every(key => {
      return item[key] === selects[key].value;
    });
  });

  filtered.forEach(item => {
    const img = document.createElement("img");
    img.src = `images/${item.src}`;
    img.alt = item.src;
    galleryDiv.appendChild(img);
  });
}


/*
==============================
初期表示
==============================
*/

refreshFavoriteList();
update();

