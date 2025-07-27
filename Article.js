//캡슐화
export default class Article {
    constructor(title, content, writer, likeCount = 0){
        this._title = title;
        this._content = content;
        this._writer = writer;
        this._likeCount = likeCount;
    }
    //getter
    get articleTitle(){
      return this._title;
    }

    //setter
    set articleTitle(title) {
      this._title = title;
    }

    //getter
    get articleContent(){
      return this._content;
    }

    //setter
    set articleContent(content) {
      this._content = content;
    }

    //getter
    get articleWriter(){
      return this._writer;
    }

    //setter
    set articleWriter(writer) {
      this._writer = writer;
    }

    like(){
      this._likeCount++;
    }

    get likeCount() {
      return this._likeCount
    }
}