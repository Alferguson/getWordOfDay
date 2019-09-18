const axios = require("axios");
const url = "https://wordsmith.org/words/today.html";

const endAtParen = str => {
  let _returnWord = [];
  let paren = "\"";
  const iterateWord = (str, index) => {
    if (index > 2000) {
      throw new Error("iterateWord index reached");
    }
    else if (str[index] === paren) {
      _returnWord = _returnWord.join("");
      return;
    }
    _returnWord.push(str[index]);
    iterateWord(str, index + 1);
  }
  iterateWord(str, 0);
  return _returnWord;
}

const findWordAndDesc = htmlStr => {
  let word = "";
  let description = "";
  const wordProp = "og:title";
  const descProp = "og:description";
  const iterateHtmlStr = index => {
    if (index > 2000) {
      throw new Error("Properties not found within 2000 characters");
    }
    // look for property string
    else if (htmlStr[index] === "p") {
      const possibleProp = htmlStr.slice(index, index + 8);
      if (possibleProp === "property") {
        if (htmlStr.slice(index + 10, index + 18) === wordProp) {
          word = endAtParen(htmlStr.slice(index + 29));
          console.log(word)
        }
        else if (htmlStr.slice(index + 10, index + 24) === descProp) {
          description = endAtParen(htmlStr.slice(index + 35));
          console.log(description)
          return;
        }
      }
    }
    iterateHtmlStr(index + 1);
  }
  iterateHtmlStr(0);
  return ({
    word,
    description
  });
}

const wordOfDayCall = new Promise( async (resolve, reject) => {
  try {
    const res = await axios.get(url);
    const { data } = res;
    
    resolve(findWordAndDesc(data));
  } catch (err) {
    console.error(err);
    reject(err);
  }
});

const wordAndDesc = async () => {
  try {
    const res = await wordOfDayCall;
    console.log(res);
  } catch (error) {
    console.error(error);
  }
}

wordAndDesc();
