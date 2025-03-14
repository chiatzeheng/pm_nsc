/*
    Contain the following type(s) of question:
    - accessing 1D array
    - accessing 2D array
    - get length of 1D, 2D array
    - .pop() function
    - .push() function
    - basic mathematical operations among values in array
*/
class ArrayIndexOperationsTemp {
  constructor(difficulty) {
    // retrieve arithmetic operation on index related question/ answer
    this.question = this.generateQuestion(difficulty);
    this.answer = this.generateAnswer(this.question[1]);
    this.fullQuestion = this.generateFullQuestion(this.question);
    this.category = ["array"];
  }

  /*
       Return a random alphabet
   */
  generateAlphabet() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    return alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  /*
        Return a random number from x to 4 + x
    */
  generateArrayLen(x) {
    return Math.floor(Math.random() * 4) + x;
  }

  /*
        Return an array consisting of:
        [0] - string concatenated array of random size 2 to 4
        [1] - string concatenated array's length
    */
  generateInnerArray() {
    var arrLen = Math.floor(Math.random() * 3) + 2;
    var query = "[ ";
    for (let i = 0; i < arrLen; i++) {
      query += `${Math.floor(Math.random() * 10)}`;
      if (i != arrLen - 1) {
        query += ", ";
      }
    }
    query += " ]";
    return [query, arrLen];
  }

  /*
        Return an 1D array consisting of:
        [0] - string concatenated index operations question
        [1] - string concatenated index operations question with variable for evaluation
    */
  generateQuestion(difficulty) {
    var arrLen = this.generateArrayLen(6);
    //var alpha = this.generateAlphabet();
    var actualArray = [];
    var query = "\tvar arr = [ ";
    var query2;
    // generate array
    for (let i = 0; i < arrLen; i++) {
      var rnd = Math.floor(Math.random() * 10);
      query += `${rnd}`;
      actualArray.push(rnd);
      if (i != arrLen - 1) {
        query += ", ";
      }
    }

    // performing arithmetic operation
    query += ` ];\n\tvar output = arr[${Math.floor(Math.random() * arrLen)}]`;

    var noOfVar;
    if (difficulty == "beginner") {
      noOfVar = Math.floor(Math.random() * 10) % 3 == 0 ? 1 : 2;
      for (var i = 0; i < noOfVar; i++) {
        var rnd = Math.floor(Math.random() * 10);
        query +=
          rnd < 5
            ? ` - arr[${Math.floor(Math.random() * arrLen)}]`
            : ` + arr[${Math.floor(Math.random() * arrLen)}]`;
      }
    } else {
      noOfVar = Math.floor(Math.random() * 10) % 2 == 0 ? 2 : 3;
      for (var i = 0; i < noOfVar; i++) {
        var rnd = Math.floor(Math.random() * 10);
        var forModulas = Math.floor(Math.random() * arrLen);
        query +=
          rnd < 3
            ? ` - arr[${Math.floor(Math.random() * arrLen)}]`
            : rnd < 5
            ? ` * arr[${Math.floor(Math.random() * arrLen)}]`
            : rnd < 7 && actualArray[forModulas] != 0
            ? ` % arr[${forModulas}]`
            : ` + arr[${Math.floor(Math.random() * arrLen)}]`;
        //                  ^ check to prevent x % 0 == NaN
      }
    }

    query += `;\n`;
    query2 = query + `output`;
    query += `\tconsole.log( output );`;
    return [query, query2];
  }

  /*
        Return the evaulation of the question
    */
  generateAnswer(question): string | number {
    return eval(question);
  }

  generateFullQuestion(question) {
    var fullQuestion = `What is the output of the following code? 
${question[0]}`;

    return fullQuestion;
  }
}

export default ArrayIndexOperationsTemp;
