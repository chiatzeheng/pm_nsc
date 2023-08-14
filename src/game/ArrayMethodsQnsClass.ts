/*
    Contain the following type(s) of question:
    - accessing 1D array
    - accessing 2D array
    - get length of 1D, 2D array
    - .pop() function
    - .push() function
    - basic mathematical operations among values in array
*/
class ArrayMethodsTemp {
  constructor(difficulty) {
    // retrieve pop/push methods related question/ answer
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
       Return either .pop() or .push() question:
       [0] - string concatenated format
       [1] - string concatenated format for evaluation
   */
  generateQuestion(difficulty) {
    var arrLen = this.generateArrayLen(4);
    var alpha = this.generateAlphabet();
    var query = "\tvar arr = ";
    var query2;
    // generate 1D array
    query += "[ ";
    for (let i = 0; i < arrLen; i++) {
      query += `${Math.floor(Math.random() * 10)}`;
      if (i != arrLen - 1) {
        query += ", ";
      }
    }
    query += " ];";

    if (Math.floor(Math.random() * 10) < 5) {
      // pop question
      query += `\n\tvar ${alpha} = arr.pop();`;
      query2 = query + `\n// pop `;
    } else {
      // push question
      query += `\n\tvar ${alpha} = arr.push( ${Math.floor(
        Math.random() * 10
      )} );`;
      query2 = query + `\n// push `;
    }

    query2 += `\n${alpha}`;
    query += `\n\tconsole.log( ${alpha} );`;
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

export default ArrayMethodsTemp;
