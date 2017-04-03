/**
 * Created by Lenovo z50-70 on 12.03.2017.
 */
var GLOBAL_DETAILED_ARTICLE_ID;

var articleModel = (function () {
            var GLOBAL_ARTICLES = [{}];

            var TAGS_BASE = ["Мир", "SpaceX", "Илон Маск", "Спорт", "Экономика", "общество", "врачи", "Минск", "Беларусь", "налог", "тунеядство", "спорт", "БАТЭ", "Футбол"]
            var AUTOR_BASE = ['Alexander Mikulich', 'Ivanov Ivan'];


            function getArticles(skip, top, filterConfig) {
                skip = skip || 0;
                top = top || 10;

                var newArticles = [];
                GLOBAL_ARTICLES.forEach(function (item, i, GLOBAL_ARTICLES) {
                    newArticles[i] = item;
                });

                newArticles.sort(function (a, b) {
                    return b.createdAt - a.createdAt;
                });

                if (filterConfig) {
                    return newArticles.filter(function (element) {
                        if (filterConfig.author) {
                            if (element.author !== filterConfig.author) {
                                return false;
                            }
                        }

                        if (filterConfig.dateStart) {
                            if (element.createdAt.getTime() <= filterConfig.dateStart.getTime()) {
                                return false;
                            }
                        }
                        if (filterConfig.dateEnd) {
                            if (element.createdAt.getTime() >= filterConfig.dateEnd.getTime()) {
                                return false;
                            }
                        }


                        if (filterConfig.tags) {
                            for (var i = 0; i < filterConfig.tags.length; i++) {
                                for (var j = 0; j < filterConfig.tags.length; j++) {
                                    if (filterConfig.tags[i] === filterConfig.tags[j]) {
                                        return false;
                                    }
                                }
                            }
                        }


                        /*
                         if (filterConfig.tags && !filterConfig.tags.every(function (tag) {
                         return element.tags.some(function (tagArticle) {
                         return tag === tagArticle;
                         })
                         }())) {
                         return false;
                         }
                         */
                        return true;
                    }).slice(skip, skip + top);
                }
                else {
                    return newArticles.slice(skip, skip + top);
                }
            }


            function getArticle(curid) {
                return GLOBAL_ARTICLES.filter(function (currentElement) {
                    return currentElement.id == curid;
                });
            }


            function validateArticle(article) {
                if (typeof(article.id) != "string") return false;
                if (typeof(article.title) != "string") return false;
                if (typeof(article.title.length) < 0) return false;
                if (typeof(article.summary) != "string") return false;
                if (typeof(article.summary.length) < 0) return false;
                if (typeof(article.createdAt) != "object") return false;
                if (typeof(article.author) != "string") return false;
                if (article.tags.length < 0) return false;
                return true;
            }


            function addArticle(article) {
                if (validateArticle(article)) {
                    GLOBAL_ARTICLES.push(article);
                    return true;
                } else return false;
            }

            function editArticle(id, article) {
                if (validateArticle(article)) {
                    getArticle(id)[0].title = article.title;
                    getArticle(id)[0].summary = article.summary;
                    return true;
                } else return false;
            }

            function removeArticle(id) {
                for (var i = 0; i < GLOBAL_ARTICLES.length; i++) {
                    if (GLOBAL_ARTICLES[i].id === id) {
                        GLOBAL_ARTICLES.splice(i, 1);
                    }
                }
            };


            function addTag(id, teg) {
                var key = 0;
                for (var i = 0; i < TAGS_BASE.length; i++) {
                    if (TAGS_BASE[i] == teg) {
                        key = 1;
                    }
                }
                if (key > 0) {
                    for (var i = 0; i < GLOBAL_ARTICLES.length; i++) {
                        if (GLOBAL_ARTICLES[i].id == id) {
                            GLOBAL_ARTICLES[i].tags.push(teg);
                            return true;
                        }
                    }
                } else return false;
            }

            function removeTag(id, teg) {
                for (var i = 0; i < GLOBAL_ARTICLES.length; i++) {
                    if (GLOBAL_ARTICLES[i].id == id) {
                        for (var j = 0; j < GLOBAL_ARTICLES[i].tags.length; j++) {
                            if (GLOBAL_ARTICLES[i].tags[j] === teg) {
                                delete GLOBAL_ARTICLES[i].tags[j];
                                GLOBAL_ARTICLES[i].tags.length--;
                                return true;
                            }
                        }
                    }
                }
                return false;
            }

            function replaceArticles() {
                GLOBAL_ARTICLES = JSON.parse(dbRequestModel.getArticles())  ;
                for (var i = 0; i < GLOBAL_ARTICLES.length; i++)
                    GLOBAL_ARTICLES[i].createdAt = new Date(GLOBAL_ARTICLES[i].createdAt);
            }


            return {
                GLOBAL_ARTICLES: GLOBAL_ARTICLES,
                replaceArticles: replaceArticles,
                getArticles: getArticles,
                getArticle: getArticle,
                validateArticle: validateArticle,
                addArticle: addArticle,
                editArticle: editArticle,
                removeArticle: removeArticle,
                addTag: addTag,
                removeTag: removeTag
            };
        }

        ()
    )
    ;


var articleRenderer = (function () {
    var ARTICLE_TEMPLATE;
    var ARTICLE_LIST_NODE;
    var DETAILED_ARTICLE_TEMPLATE;

    function init() {
        ARTICLE_TEMPLATE = document.querySelector('#template-article-list-item');
        ARTICLE_LIST_NODE = document.querySelector('#news');
    }

    function insertArticlesInDOM(articles) {
        var articlesNodes = renderArticles(articles);
        articlesNodes.forEach(function (node) {
            ARTICLE_LIST_NODE.appendChild(node);
        });
    }

    function removeArticlesFromDom() {
        ARTICLE_LIST_NODE.innerHTML = '';
    }

    function renderArticles(articles) {
        return articles.map(function (article) {
            return renderArticle(article);
        });
    }


    function renderArticle(article) {
        var template = ARTICLE_TEMPLATE;
        template.content.querySelector('.article-list-item').dataset.id = article.id;
        template.content.querySelector('.article-list-item-title').textContent = article.title;
        template.content.querySelector('.article-list-item-summary').textContent = article.summary;
        template.content.querySelector('.article-list-item-author').textContent = article.author;
        template.content.querySelector('.article-list-item-date').textContent = formatDate(article.createdAt);
        template.content.querySelector('.article-list-item-img').setAttribute("src", article.image);

        var newTags = [];
        for (var i = 0; i < article.tags.length; i++) {
            newTags[i] = "#" + article.tags[i];
        }

        template.content.querySelector('#article-list-item-tags-first').textContent = newTags[0];
        template.content.querySelector('#article-list-item-tags-second').textContent = newTags[1];
        template.content.querySelector('#article-list-item-tags-third').textContent = newTags[2];
        template.content.querySelector('#article-list-item-tags-fourth').textContent = newTags[3];
        template.content.querySelector('#article-list-item-tags-fifth').textContent = newTags[4];

        return template.content.querySelector('.article-list-item').cloneNode(true);
    }


    function formatDate(d) {
        return d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear() + " | " +
            d.getHours() + ':' + d.getMinutes();
    }

    return {
        init: init,
        insertArticlesInDOM: insertArticlesInDOM,
        removeArticlesFromDom: removeArticlesFromDom
    };
}());


document.addEventListener('DOMContentLoaded', startApp);


function startApp() {

    articleModel.replaceArticles();
    articleRenderer.init();
    renderArticles();


    /* var articleButton = document.querySelector(".article-list-item-title");
     articleButton.onclick = function () {
     renderDetailedArticle(articleButton.parentNode.parentNode);
     }*/
}

function renderArticles(skip, top) {
    articleRenderer.removeArticlesFromDom();
    var articles = articleModel.getArticles(skip, top);
    articleRenderer.insertArticlesInDOM(articles);
}

function renderDetailedArticle(object) {
    document.querySelector(".wrap").style.display = "none";
    //articleRenderer.removeArticlesFromDom();
    GLOBAL_DETAILED_ARTICLE_ID = object.dataset.id;
    var detailedArticle = articleModel.getArticle(GLOBAL_DETAILED_ARTICLE_ID);

    insertDetailedArticlesInDOM(detailedArticle);
    document.querySelector("#news").style.display = "none";
    document.querySelector("#main-article").style.display = "block";
    document.querySelector(".pagination").style.display = "none";
}

function insertDetailedArticlesInDOM(articles) {
    DETAILED_ARTICLE_LIST_NODE = document.querySelector("#main-article");
    DETAILED_ARTICLE_LIST_NODE.innerHTML = '';
    var articlesNodes = renderDetailedMapArticle(articles);
    articlesNodes.forEach(function (node) {
        DETAILED_ARTICLE_LIST_NODE.appendChild(node);
    });
}


function renderDetailedMapArticle(articles) {
    return articles.map(function (article) {
        return renderMainArticle(article);
    });
}
function renderMainArticle(article) {
    DETAILED_ARTICLE_TEMPLATE = document.querySelector('#template-detaild-article-list-item');
    var template = DETAILED_ARTICLE_TEMPLATE;
    template.content.querySelector('.detailed-article-list-item').dataset.id = article.id;
    template.content.querySelector('.detailed-article-list-item-title').textContent = article.title;
    template.content.querySelector('.detailed-article-list-item-summary').textContent = article.summary;
    template.content.querySelector('.detailed-article-list-item-author').textContent = article.author;
    template.content.querySelector('.detailed-article-list-item-date').textContent = formatDate(article.createdAt);
    template.content.querySelector('.detailed-article-list-item-img').setAttribute("src", article.image);
    return template.content.querySelector('.detailed-article-list-item').cloneNode(true);
}

function formatDate(d) {
    return d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear() + " | " +
        d.getHours() + ':' + d.getMinutes();
}


function addArticleItem() {

    article_add = {
        id: new Date().toDateString(),
        title: document.querySelector("#add-news-form-title").value,
        tags: document.querySelector("#add-news-form-tags").value.split(","),
        summary: document.querySelector("#add-news-form-summary").value,
        createdAt: new Date(),
        author: username
    };


    console.log(articleModel.getArticles(1, 100));
    dbRequestModel.addArticle(article_add);
    document.querySelector("#news").style.display = "block";
    document.querySelector(".wrap").style.display = "block";
    document.querySelector(".pagination").style.display = "block";
    startApp();
    document.querySelector("#add-news-block").style.display = "none";
    console.log(articleModel.getArticles(1, 100));

}


function showAddArticleForm() {
    document.querySelector("#add-news-block").style.display = "block";
    document.querySelector("#news").style.display = "none";
    document.querySelector(".wrap").style.display = "none";
    document.querySelector(".pagination").style.display = "none";
}

function showEditArticleForm() {
    var article = articleModel.getArticle(GLOBAL_DETAILED_ARTICLE_ID)[0];
    document.querySelector("#edit-news-form-title").value = article.title;
    document.querySelector("#edit-news-form-summary").value = article.summary;
    document.querySelector("#edit-news-form-content").value = article.summary;
    document.querySelector("#edit-news-form-image").value = article.image;
    document.querySelector("#edit-news-form-tags").value = article.tags;

    document.querySelector("#edit-news-block").style.display = "block";
    document.querySelector("#main-article").style.display = "none";
    document.querySelector(".pagination").style.display = "none";

}


function editArticleItem() {
    var article = {
        id: "9000",
        title: document.querySelector("#edit-news-form-title").value,
        summary: document.querySelector("#edit-news-form-summary").value,
        content: document.querySelector("#edit-news-form-content").value,
        author: username,
        image: document.querySelector("#edit-news-form-image").value,
        tags: document.querySelector("#edit-news-form-tags").value.split(",")
    };

    var article2 = articleModel.getArticle(GLOBAL_DETAILED_ARTICLE_ID)[0];
    article2.title = article.title;
    article2.summary = article.summary;


    startApp();

    document.querySelector("#edit-news-block").style.display = "none";
    document.querySelector("#news").style.display = "block";
    document.querySelector(".wrap").style.display = "block";
    document.querySelector(".pagination").style.display = "block";
    console.log(articleModel.getArticles(1, 100));
}

function deleteArticle() {
    dbRequestModel.deleteArticle(GLOBAL_DETAILED_ARTICLE_ID);
    startApp();
    document.querySelector("#news").style.display = "block";
    document.querySelector(".wrap").style.display = "block";
    document.querySelector(".pagination").style.display = "block";
    document.querySelector("#main-article").style.display = "none";
}

var GLOBAL_TOP = 20;
function showMore() {
    articleRenderer.init();
    renderArticles(0, GLOBAL_TOP);
    GLOBAL_TOP = GLOBAL_TOP + 10;
}


function filterArticle() {

    var dateS = document.querySelector("#filter-form-date-start").value.split(".");
    var dateE = document.querySelector("#filter-form-date-end").value.split(".");

    var filter = {
        author: document.querySelector("#filter-form-author").value,
        dateStart: new Date(dateS[2], dateS[1], dateS[0], 0, 0, 1),
        dateEnd: new Date(dateE[2], dateE[1], dateE[0], 23, 59, 0),
        tags: document.querySelector("#filter-form-tags").value.split(",")
    };

    console.log(document.querySelector("#filter-form-tags").value.split(","));


    articleRenderer.removeArticlesFromDom();
    var articles = articleModel.getArticles(0, 100, filter);
    articleRenderer.insertArticlesInDOM(articles);
}


/*---------------------------- Логирование основное задание---------------------------------------------*/


/*
 console.log(" Новости от 0 до 10: ");
 console.log(articleModel.getArticle(0,10));

 console.log(" Новости от 0 до 10 по Автору: ");
 var filter1 ={
 author: "Alexander Mikulich"
 };
 console.log(articleModel.getArticles(0,10,filter1));

 console.log("Выводим Новости от 0 до 10 по Автору и по дате с 05:24:00 и до 08:24:00");
 var filter2 ={
 author: "Alexander Mikulich",
 dateStart: new Date(2017, 11, 17, 5, 24, 0),
 dateEnd: new Date(2017, 11, 17, 8, 24, 0)
 };
 console.log(articleModel.getArticles(0,10,filter2));



 console.log("Удаляем новость с id 5, и выводим все новости, убеждаясь, что число всех новостей уменьшилось на 1");
 articleModel.removeArticle(5);
 console.log(articleModel.getArticles(0,10,filter2));


 console.log("Проверка на валидность: заведомо валидные данные");

 //console.log(articleModel.validateArticle(GLOBAL_ARTICLES[0]));
 console.log("Проверка на валидность: заведомо не валидные данные(id не string)");
 //console.log(articles[1]);
 //console.log(validateArticle(articles[1]));


 article1 = {
 id: '5',
 title: 'ДОБАВЛЕННАЯ НОВОСТЬ',
 tags: ["спорт", "БАТЭ", "Футбол"],
 summary: 'ДОБАВИЛИ НОВОСТЬ ',
 createdAt: new Date(2017, 11, 17, 8, 24, 0),
 author: 'Ivanov Ivan'
 };

 articleModel.addArticle(article1);
 //console.log(articleModel.GLOBAL_ARTICLES[19])

 startApp();

 articleEditor = {
 title: 'НОВОСТЬ ПОСЛЕ ИЗМЕНЕНИЯ',
 summary: 'ИЗМЕНИЛИ НОВОСТЬ'
 };

 console.log(articleModel.getArticle(1));
 articleModel.editArticle(1,articleEditor);
 console.log(articleModel.getArticle(1));
 startApp();

 /*-------------------------------Логирование дополнительное задание: работа с Тегами--------------------------------*/


/*
 console.log('Добавим тег "SpaceX" к изменённой новости');
 articleModel.addTag(1,"SpaceX");

 startApp();
 console.log(' Новости по тегу "SpaceX": ')
 var filter1 ={
 tags: ["SpaceX"]
 };
 startApp();
 console.log(articleModel.getArticles(0,10,filter1));

 console.log('Уберём тег "SpaceX" из изменённой новости');
 articleModel.removeTag(1,"SpaceX");
 console.log(articleModel.getArticle(1));
 startApp();
 */
/*---------------------------- Логирование основное задание---------------------------------------------*/


/*
 console.log(" Новости от 0 до 10: ");
 console.log(articleModel.getArticle(0,10));

 console.log(" Новости от 0 до 10 по Автору: ");
 var filter1 ={
 author: "Alexander Mikulich"
 };
 console.log(articleModel.getArticles(0,10,filter1));

 console.log("Выводим Новости от 0 до 10 по Автору и по дате с 05:24:00 и до 08:24:00");
 var filter2 ={
 author: "Alexander Mikulich",
 dateStart: new Date(2017, 11, 17, 5, 24, 0),
 dateEnd: new Date(2017, 11, 17, 8, 24, 0)
 };
 console.log(articleModel.getArticles(0,10,filter2));



 console.log("Удаляем новость с id 5, и выводим все новости, убеждаясь, что число всех новостей уменьшилось на 1");
 articleModel.removeArticle(5);
 console.log(articleModel.getArticles(0,10,filter2));


 console.log("Проверка на валидность: заведомо валидные данные");

 //console.log(articleModel.validateArticle(GLOBAL_ARTICLES[0]));
 console.log("Проверка на валидность: заведомо не валидные данные(id не string)");
 //console.log(articles[1]);
 //console.log(validateArticle(articles[1]));


 article1 = {
 id: '5',
 title: 'ДОБАВЛЕННАЯ НОВОСТЬ',
 tags: ["спорт", "БАТЭ", "Футбол"],
 summary: 'ДОБАВИЛИ НОВОСТЬ ',
 createdAt: new Date(2017, 11, 17, 8, 24, 0),
 author: 'Ivanov Ivan'
 };

 articleModel.addArticle(article1);
 //console.log(articleModel.GLOBAL_ARTICLES[19])

 startApp();

 articleEditor = {
 title: 'НОВОСТЬ ПОСЛЕ ИЗМЕНЕНИЯ',
 summary: 'ИЗМЕНИЛИ НОВОСТЬ'
 };

 console.log(articleModel.getArticle(1));
 articleModel.editArticle(1,articleEditor);
 console.log(articleModel.getArticle(1));
 startApp();

 /*-------------------------------Логирование дополнительное задание: работа с Тегами--------------------------------*/


/*
 console.log('Добавим тег "SpaceX" к изменённой новости');
 articleModel.addTag(1,"SpaceX");

 startApp();
 console.log(' Новости по тегу "SpaceX": ')
 var filter1 ={
 tags: ["SpaceX"]
 };
 startApp();
 console.log(articleModel.getArticles(0,10,filter1));

 console.log('Уберём тег "SpaceX" из изменённой новости');
 articleModel.removeTag(1,"SpaceX");
 console.log(articleModel.getArticle(1));
 startApp();
 */
