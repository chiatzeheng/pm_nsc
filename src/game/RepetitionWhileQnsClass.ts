/*
    Contain the following type(s) of question:
    - var count = 1;
      while (count < 5) {
        count++;
      }
      console.log( count );
*/
class WhileRepetitionTemp {
  constructor(difficulty) {
    this.question = this.generateQuestion(difficulty);
    this.answer = this.generateAnswer(this.question[1]);
    this.fullQuestion = this.generateFullQuestion(this.question);
    this.category = ["while loop"];
  }
  /*
        Return a random alphabet
    */
  generateAlphabet() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    return alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  /*
        Return a random number from 0 to 9
    */
  generateRnd10() {
    return Math.floor(Math.random() * 10);
  }

  /*
        Return an array consisting of:
        [0] - string concatenated while loop question
        [1] - string concatenated while loop question with counter for evaluation
    */
  generateQuestion(difficulty) {
    var alpha = this.generateAlphabet();
    var small = Math.floor(Math.random() * 5);
    var big = Math.floor(Math.random() * 10) + 15;
    var query = `\n\tvar ${alpha} = `;
    var query2 = `// while `;

    if (difficulty == "beginner" || this.generateRnd10() % 4 == 0) {
      if (this.generateRnd10() % 2 == 0) {
        // Increment while Loop
        var sign = this.generateRnd10() % 2 == 0 ? "<" : "<=";
        query += `${small};\n\twhile ( ${alpha} ${sign} ${big} ) {\n\t    ${alpha}++;\n\t}`;
      } else {
        // Decrement while Loop
        var sign = this.generateRnd10() % 2 == 0 ? ">" : ">=";
        query += `${big};\n\twhile ( ${alpha} ${sign} ${small} ) {\n\t    ${alpha}--;\n\t}`;
      }
    } else if (difficulty == "intermediate") {
      var rnd = this.generateRnd10();
      if (this.generateRnd10() % 2 == 0) {
        // Increment while Loop
        var sign = rnd < 3 ? "<=" : rnd < 5 ? "<" : rnd < 9 ? "!=" : "==";
        query += `${small};\n\twhile ( ${alpha} ${sign} ${big} ) {\n\t    ${alpha}`;
        if (this.generateRnd10() % 4 == 0) {
          query += `++;\n\t}`;
        } else {
          query += ` += ${Math.floor(Math.random() * 4) + 1};\n\t}`;
        }
      } else {
        // Decrement while Loop
        var sign = rnd < 3 ? ">=" : rnd < 5 ? ">" : rnd < 9 ? "!=" : "==";
        query += `${big};\n\twhile ( ${alpha} ${sign} ${small} ) {\n\t    ${alpha}`;
        if (this.generateRnd10() % 4 == 0) {
          query += `--;\n\t}`;
        } else {
          query += ` -= ${Math.floor(Math.random() * 4) + 1};\n\t}`;
        }
      }
    }

    query2 += query + `\n${alpha}`;
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

export default WhileRepetitionTemp;
