/*
    Contain the following type(s) of question:
    - accessing 1D array
    - accessing 2D array
    - get length of 1D, 2D array
    - .pop() function
    - .push() function
    - basic mathematical operations among values in array
*/
class ArrayLengthTemp {
  constructor(difficulty) {
    // length related question/ answer
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
        Return an 1D/ 2D array consisting of:
        [0] - string concatenated .length question
        [1] - string concatenated .length question with len for evaluation
    */
  generateQuestion(difficulty) {
    var arrLen = this.generateArrayLen(4);
    var query = "\tvar arr = ";
    if (difficulty == "beginner" || Math.floor(Math.random() * 10) < 3) {
      if (Math.floor(Math.random() * 10) < 5) {
        // generate 1D array
        query += "[ ";
        for (let i = 0; i < arrLen; i++) {
          query += `${Math.floor(Math.random() * 10)}`;
          if (i != arrLen - 1) {
            query += ", ";
          }
        }
        query += " ];";
      } else {
        // generate array use new keyword
        if (Math.floor(Math.random() * 10) < 6) {
          query += `new Array(${arrLen});`;
        } else {
          query += `new Array(`;
          for (let i = 0; i < arrLen; i++) {
            query += `${Math.floor(Math.random() * 10)}`;
            if (i != arrLen - 1) {
              query += ", ";
            }
          }
          query += `);`;
        }
      }
    } else {
      // generate 2D array
      query += "[ ";
      for (let i = 0; i < arrLen; i++) {
        // insert inner array when both condition are met (random)
        if (Math.floor(Math.random() * 5) < 3 && i % 2 == 0) {
          query += this.generateInnerArray()[0];
        } else {
          query += `${Math.floor(Math.random() * 10)}`;
        }

        if (i != arrLen - 1) {
          query += ", ";
        }
      }
      query += " ];";
    }
    query += "\n\tvar len = arr.length;\n";
    var query2 = query + "// length \nlen";
    query += "\tconsole.log( len );";
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

export default ArrayLengthTemp;
