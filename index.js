var modal = document.getElementsByClassName("modal")[0]
        var backdrop = document.getElementsByClassName("backdrop")[0]
        var prevButton = document.getElementById("prev")
        var nextButton = document.getElementById("next")
        var submitButton = document.getElementById("submit")
        submitButton.style.display = "none";
        modal.style.display = "none";
        backdrop.style.display = "none";
        var resultArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var answeredArray = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
        var result = 0;
        var currentQuestionNumber = 0;
        var set = [];
        fetch("https://quizapi.io/api/v1/questions?apiKey=ggXlo1dnTuHkQLGb2mN4aZwVcPWOJ8InWkvtpbV1&limit=10&category=Linux").then(res => res.json()).then(data => {
            set = data.map((elem, index) => {
                return {
                    ...elem,
                    id: index + 1
                }
            })
            console.log(set)
            displayQuestion(0);
        })
        function displayQuestion(questionNumber) {
            var spanElem = document.getElementsByClassName("current")[0]
            if (spanElem != undefined) {
                spanElem.classList.remove("current")
            }
            var options = "";
            var keys = Object.keys(set[questionNumber].answers)
            // if (document.getElementById("span" + (currentQuestionNumber + 1)).classList.contains("answered")) {
            Object.values(set[questionNumber].answers).map((ans, index) => {
                if (ans + "" != "null") {
                    var keyNumber = keys[index] + "_correct";
                    var classlist = "";
                    if (answeredArray[currentQuestionNumber] == (index + 1)) {
                        classlist += "answerClicked";
                    }
                    if (set[questionNumber].correct_answers[keyNumber] == "true")
                        classlist += " correct"

                    options += `<div class="answer${index + 1} answer ${classlist}"  onclick="answerClick(this)">${ans}</div>`
                }
            })
            // }
            var temp = ` <div class="question_holder">
                <div class="question">${set[questionNumber].question}</div>
                <div class="answers">
                    ${options}
                </div>`
            document.getElementsByClassName("question_holder")[0].innerHTML = temp
            document.getElementById("span" + (questionNumber + 1)).classList.add("current")
        }
        backdrop.addEventListener("click", () => {
            modal.style.display = "none";
            backdrop.style.display = "none";
        })
        function next(e) {
            if (e.innerText == "Submit") {
                if (document.getElementsByClassName("answerClicked")[0]) {
                    resultArray[currentQuestionNumber] = document.getElementsByClassName("answerClicked")[0].classList.contains("correct") ? 1 : 0;
                    document.getElementById("span" + (currentQuestionNumber + 1)).classList.add("answered")
                    answeredArray[currentQuestionNumber] = document.getElementsByClassName("answerClicked")[0].classList[0][document.getElementsByClassName("answerClicked")[0].classList[0].length - 1];
                }
                modal.style.display = "block";
                backdrop.style.display = "block";
                var sum = 0;
                for (var i = 0; i < resultArray.length; i++) sum += resultArray[i];
                modal.innerHTML = "<h1 style='color:white;padding:10px'>Total score is " + sum + "</h1>";
            }
            if (currentQuestionNumber == set.length - 2) {
                submitButton.style.display = "block";
                nextButton.style.display = "none";
            }
            if (currentQuestionNumber < set.length - 1) {
                if (document.getElementsByClassName("answerClicked")[0]) {
                    resultArray[currentQuestionNumber] = document.getElementsByClassName("answerClicked")[0].classList.contains("correct") ? 1 : 0;
                    document.getElementById("span" + (currentQuestionNumber + 1)).classList.add("answered")
                    answeredArray[currentQuestionNumber] = document.getElementsByClassName("answerClicked")[0].classList[0][document.getElementsByClassName("answerClicked")[0].classList[0].length - 1];
                }
                displayQuestion(++currentQuestionNumber);
            }
        }
        function prev(e) {
            submitButton.style.display = "none";
            nextButton.style.display = "block";
            if (currentQuestionNumber > 0)
                displayQuestion(--currentQuestionNumber)
        }
        function answerClick(e) {
            if (e.classList.contains("answerClicked")) {
                document.getElementById("span" + (currentQuestionNumber + 1)).classList.contains("answered") ? document.getElementById("span" + (currentQuestionNumber + 1)).classList.remove("answered") : 0;
                answeredArray[currentQuestionNumber] = -1;
                e.classList.remove("answerClicked");
                resultArray[currentQuestionNumber] = 0;
            }
            else {
                document.getElementsByClassName("answerClicked")[0] ? document.getElementsByClassName("answerClicked")[0].classList.remove("answerClicked") : 0;
                e.classList.add("answerClicked");
            }
        }

        function spanClick(e) {
            currentQuestionNumber = e.id.slice(4) - 1;
            if (currentQuestionNumber == 9) {
                submitButton.style.display = "block";
                nextButton.style.display = "none";
            }
            else {
                submitButton.style.display = "none";
                nextButton.style.display = "block";
            }
            displayQuestion(currentQuestionNumber);
        }
