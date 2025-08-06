async function getArticleList(url: URL, page: string, pageSize: string, keyword: string){
    url.searchParams.append('page', page);
    url.searchParams.append('pageSize', pageSize);
    url.searchParams.append('keyword', keyword);
    const result = fetch(url)
    .then((res)=> {
        if (!res.ok){
            throw new Error(`데이터를 불러오는데 실패했어요!`);
        }
        return res.json();
    })
    .catch((err) => console.log(err.message));
    return result; // promise + fulfiled + undefined
}

async function getArticle(url: URL, id: number){
    const result = fetch(`${url}/${id}`)
    .then((res)=> {
        if (!res.ok){
            throw new Error(`데이터를 불러오는데 실패했어요!`);
        }
        return res.json();
    })
    .catch((err) => console.log(err.message));
    return result;
}



async function createArticle(url: URL, image: string, content: string, title: string){
    const result = fetch(url, {
        method : "POST",
        headers : {
            "Content-Type" : 'application/json'
        },
        body : JSON.stringify({
            "image" : image,
            "content" : content,
            "title" : title
        })
    })
    .then((res)=> {
        if (!res.ok){
            throw new Error(`생성 요청을 실패했어요!`);
        }
        return res.json();
    })
    .catch((err) => console.log(err.message));
    return result;
}

async function patchArticle(url: URL, id: number, image: string, content: string, title: string){
    const result = fetch(`${url}/${id}`, {
        method : "PATCH",
        headers : {
            "Content-Type" : 'application/json'
        },
        body : JSON.stringify({
            "image" : image,
            "content" : content,
            "title" : title
        })
        
    })
    .then((res)=> {
        if (!res.ok){
            throw new Error(`수정 요청을 실패했어요!`);
        }
        return res.json();
    })
    .catch((err) => console.log(err.message));
    return result;
}

async function deleteArticle(url: URL, id: number){
    const result = fetch(`${url}/${id}`, {
        method : "DELETE",
    }
    )
    .then((res)=> {
        if (!res.ok){
            throw new Error(`데이터를 삭제하는데 실패했어요!`);
        }
        return res.json();
    })
    .catch((err) => console.log(err.message));

    return result;
}

export {getArticle, getArticleList, createArticle, patchArticle, deleteArticle};

