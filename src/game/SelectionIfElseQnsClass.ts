/*
    Contain the following type(s) of question:
    - var a = 2, b = 3;
      if ( a > b ) {
          a += 3;
      }
      b--;
      console.log ( a + b );
    
    - var c = 1, d = 2;
      if ( c <= d )
        c += 3;
        d--;
      console.log ( c + d );

    - var e = 1, f = 2;
      if ( e != d )
        e--;
      else 
        f += 2;
      console.log ( e + f );
*/
class IfElseSelectionTemplate {
  constructor(difficulty: string) {
    // this.question = this.generateQuestion(/*difficulty*/);
    this.question = this.generateQuestion(difficulty);
    this.answer = this.generateAnswer(this.question[1]);
    this.fullQuestion = this.generateFullQuestion(this.question);
    this.category = ["if", "else"];
  }
  /*
        Return 1 random alphabets
    */
  generateAlphabet() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    return alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  /*
        Return a random number from 1 to 5
    */
  generateRnd5() {
    return Math.floor(Math.random() * 5) + 1;
  }

  /*
        Return an array consisting of:
        [0] - string concatenated if else question
        [1] - string concatenated if else question with variable for evaluation
    */
  // generateQuestion(/*difficulty*/) {
  generateQuestion(difficulty: string) {
    if (difficulty === "beginner") {
      var alpha = this.generateAlphabet();
      var var1 = alpha + "1";
      var var2 = alpha + "2";
      var query = `\n\tvar ${var1} = ${this.generateRnd5()}, ${var2} = ${this.generateRnd5()};`;
      var rnd = Math.floor(Math.random() * 10);
      var compareSign =
        rnd < 2
          ? "<"
          : rnd < 4
          ? "<="
          : rnd < 6
          ? ">"
          : rnd < 8
          ? ">="
          : "==";
      query += `\n\tif ( ${var1} ${compareSign} ${var2} )`;

      var rnd2 = Math.floor(Math.random() * 10);
      if (rnd2 < 4) {
        // if with {}
        // rnd = Math.floor(Math.random() * 12);
        // rnd2 = Math.floor(Math.random() * 12);
        // var ops = rnd < 3 ? "+" : rnd < 6 ? "*" : rnd < 9 ? "%" : "-";
        // var ops2 = rnd2 < 3 ? "+" : rnd2 < 6 ? "*" : rnd2 < 9 ? "%" : "-";
        // query += ` {\n\t    ${var1} = ${var1} ${ops} ${
        //   Math.floor(Math.random() * 5) + 1
        // };\n\t    ${var2} = ${var2} ${ops2} ${Math.floor(Math.random() * 5) + 1};\n\t}`;

        // for open house
        rnd = Math.floor(Math.random() * 10);
        rnd2 = Math.floor(Math.random() * 10);
        var ops = rnd < 4 ? "+" : "-";
        var ops2 = rnd2 < 4 ? "+" : "-";

        query += ` {\n\t    ${var1} = ${var1} ${ops} ${
          Math.floor(Math.random() * 5) + 1
        };\n\t    ${var2} = ${var2} ${ops2} ${Math.floor(Math.random() * 5) + 1};\n\t}`;

      } else {
        // if with else
        // rnd = Math.floor(Math.random() * 12);
        // rnd2 = Math.floor(Math.random() * 12);
        // var ops = rnd < 3 ? "+" : rnd < 6 ? "*" : rnd < 9 ? "%" : "-";
        // var ops2 = rnd2 < 3 ? "+" : rnd2 < 6 ? "*" : rnd2 < 9 ? "%" : "-";

        // for open house
        rnd = Math.floor(Math.random() * 10);
        rnd2 = Math.floor(Math.random() * 10);
        var ops = rnd < 4 ? "+" : "-";
        var ops2 = rnd2 < 4 ? "+" : "-";
        
        query += ` {\n\t    ${var1} = ${var1} ${ops} ${
          Math.floor(Math.random() * 5) + 1
        };\n\t} else {\n\t    ${var2} = ${var2} ${ops2} ${
          Math.floor(Math.random() * 5) + 1
        };\n\t}`;
      }

      // var rnd3 = Math.floor(Math.random() * 12);
      // var ops3 = rnd3 < 3 ? "+" : rnd3 < 6 ? "-" : rnd3 < 9 ? "*" : "%" ;

      // for open house
      var rnd3 = Math.floor(Math.random() * 10);
      var ops3 = rnd3 < 4 ? "+" : "-";

      var query2 = query + `\n${var1} ${ops3} ${var2}`; // NOTE: DO NOT INCLUDE C.L into EVAL fn
      query += `\n\tconsole.log( ${var1} ${ops3} ${var2} );`;
      return [query, query2];
    } else {
      var alpha = this.generateAlphabet();
      var var1 = alpha + "1";
      var var2 = alpha + "2";
      var query = `\n\tvar ${var1} = ${this.generateRnd5()}, ${var2} = ${this.generateRnd5()};`;
      var rnd = Math.floor(Math.random() * 12);
      var compareSign =
        rnd < 2
          ? "<"
          : rnd < 4
          ? "<="
          : rnd < 6
          ? ">"
          : rnd < 8
          ? ">="
          : rnd < 10
          ? "=="
          : "!=";
      query += `\n\tif ( ${var1} ${compareSign} ${var2} )`;

      var rnd2 = Math.floor(Math.random() * 10);
      if (rnd2 < 3) {
        // if with {}
        rnd = Math.floor(Math.random() * 12);
        rnd2 = Math.floor(Math.random() * 12);
        var ops = rnd < 3 ? "+=" : rnd < 6 ? "*=" : rnd < 9 ? "%=" : "-=";
        var ops2 = rnd2 < 3 ? "+=" : rnd2 < 6 ? "*=" : rnd2 < 9 ? "%=" : "-=";
        query += ` {\n\t    ${var1} ${ops} ${
          Math.floor(Math.random() * 5) + 1
        };\n\t    ${var2} ${ops2} ${Math.floor(Math.random() * 5) + 1};\n\t}`;
      } else if (rnd2 < 7) {
        // if without {}
        rnd = Math.floor(Math.random() * 12);
        rnd2 = Math.floor(Math.random() * 12);
        var ops = rnd < 3 ? "+=" : rnd < 6 ? "*=" : rnd < 9 ? "%=" : "-=";
        var ops2 = rnd2 < 3 ? "+=" : rnd2 < 6 ? "*=" : rnd2 < 9 ? "%=" : "-=";
        query += `\n\t    ${var1} ${ops} ${
          Math.floor(Math.random() * 5) + 1
        };\n\t    ${var2} ${ops2} ${Math.floor(Math.random() * 5) + 1};\n\t`;
      } else {
        // if with else
        rnd = Math.floor(Math.random() * 12);
        rnd2 = Math.floor(Math.random() * 12);
        var ops = rnd < 3 ? "+=" : rnd < 6 ? "*=" : rnd < 9 ? "%=" : "-=";
        var ops2 = rnd2 < 3 ? "+=" : rnd2 < 6 ? "*=" : rnd2 < 9 ? "%=" : "-=";
        query += ` {\n\t    ${var1} ${ops} ${
          Math.floor(Math.random() * 5) + 1
        };\n\t} else {\n\t    ${var2} ${ops2} ${
          Math.floor(Math.random() * 5) + 1
        };\n\t}`;
      }

      var query2 = query + `\n${var1} + ${var2}`; // NOTE: DO NOT INCLUDE C.L into EVAL fn
      query += `\n\tconsole.log( ${var1} + ${var2} );`;
      return [query, query2];
    }
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
export default IfElseSelectionTemplate;
