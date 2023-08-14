/*
    Contain the following type(s) of question:
    - accessing 1D array
    - accessing 2D array
    - get length of 1D, 2D array
    - .pop() function
    - .push() function
    - basic mathematical operations among values in array
*/
class ArrayIndexTemp {
  constructor(difficulty) {
    // retrieve index related question/ answer
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
        [0] - string concatenated get value by index question
        [1] - string concatenated get value by index question with variable for evaluation
    */
  generateQuestion(difficulty) {
    var arrLen = this.generateArrayLen(5);
    var alpha = this.generateAlphabet();
    var query = "\tvar arr = [ ";
    var query2;
    if (difficulty == "beginner" || Math.floor(Math.random() * 10) < 4) {
      // generate 1D array
      for (let i = 0; i < arrLen; i++) {
        query += `${Math.floor(Math.random() * 10)}`;
        if (i != arrLen - 1) {
          query += ", ";
        }
      }
      query += ` ];\n\tvar ${alpha} = arr[${Math.floor(
        Math.random() * arrLen
      )}];\n`;
      query2 = query + `${alpha}`;
      query += `\tconsole.log( ${alpha} );`;
    } else {
      // generate 2D array
      var storedIndexOfInnerArr = [];
      var storedLengthOfInnerArr = [];
      for (let i = 0; i < arrLen; i++) {
        // insert inner array when both condition are met (random)
        if (Math.floor(Math.random() * 5) < 3 && (i % 2 == 0 || i % 3 == 0)) {
          var generatedInnerArr = this.generateInnerArray();
          query += generatedInnerArr[0];
          // store index of where inner array is
          storedIndexOfInnerArr.push(i);
          // store length of inner array
          storedLengthOfInnerArr.push(generatedInnerArr[1]);
          // above step is to help randomize the 2D qns asked
        } else {
          query += `${Math.floor(Math.random() * 10)}`;
        }

        if (i != arrLen - 1) {
          query += ", ";
        }
      }
      // Check for either storedIndexOfInnerArr or storedLengthOfInnerArr is empty
      // if so, return 1D array question
      if (storedLengthOfInnerArr.length == 0) {
        query += ` ];\n\tvar ${alpha} = arr[${Math.floor(
          Math.random() * arrLen
        )}];\n`;
        query2 = query + `${alpha}`;
        query += `\tconsole.log( ${alpha} );`;
      } else {
        // choosing at random, the question to ask within 2D array
        var rnd = Math.floor(Math.random() * storedIndexOfInnerArr.length);
        var firstIndex = storedIndexOfInnerArr[rnd];
        var secondIndex = Math.floor(
          Math.random() * storedLengthOfInnerArr[rnd]
        );

        query += ` ];\n\tvar ${alpha} = arr[${firstIndex}][${secondIndex}];\n`;
        query2 = query + `${alpha}`;
        query += `\tconsole.log( ${alpha} );`;
      }
    }
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

export default ArrayIndexTemp;
