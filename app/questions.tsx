import {
  Pressable,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  View,
  TouchableHighlight,
  Touchable,
} from "react-native";
import { useEffect, useState } from "react";
import * as Progress from "react-native-progress";
import { Link } from "expo-router";
import React from "react";
import axios from "axios";
//import { View } from "@/components/Themed";


interface Choice {
  id: number;
  text: string;
}
interface Question {
  id: number;
  question: string;
  choices: Choice[];
}
interface UserCourse {
  Language: string;
  CurrentQuestion: number;
  NumCorrect: number;
}

const Questions = ({ route, navigation }) => {
  // User Info
  const { QuestionBank, userCourse, token } = route.params;
  //console.log(QuestionBank);
  let Language = userCourse.Language;
  if (Language == "c++") {
    Language = "C++";
  } else if (Language == "python") {
    Language = "Python";
  } else if (Language == "haskell") {
    Language = "Haskell";
  }
  const [CurrentQuestion, SetCurrentQuestion] = useState(
    userCourse.CurrentQuestion
  );

  // Question and answer choices.
  let QuestionText = QuestionBank[CurrentQuestion].QuestionText;
  let CorrectAnswer = QuestionBank[CurrentQuestion].Answer;
  let Incorrect1 = QuestionBank[CurrentQuestion].OtherChoices[0];
  let Incorrect2 = QuestionBank[CurrentQuestion].OtherChoices[1];
  let Incorrect3 = QuestionBank[CurrentQuestion].OtherChoices[2];

  // Answer choices
  const [Answer1, SetAnswer1] = useState(CorrectAnswer);
  const [Answer2, SetAnswer2] = useState(Incorrect1);
  const [Answer3, SetAnswer3] = useState(Incorrect2);
  const [Answer4, SetAnswer4] = useState(Incorrect3);

  // Progress bar control.
  const [progress, SetProgress] = useState(userCourse.CurrentQuestion * 10);

  // Sets the value for incorrect and correct question counters.
  const [QuestionsCorrect, SetQuestionsCorrect] = useState(
    userCourse.NumCorrect
  );
  const [QuestionsIncorrect, SetQuestionsIncorrect] = useState(
    userCourse.CurrentQuestion - userCourse.NumCorrect
  );

  // For conditional display of buttons and messages.
  const [Tries, SetTries] = useState(0);
  const [Correct, SetCorrect] = useState(false);
  const [Incorrect, SetIncorrect] = useState(false);
  const [IncorrectTryAgain, SetTryAgain] = useState(false);
  const [NextButton, SetNextButton] = useState(false);
  const [RestartButton, SetRestartButton] = useState(false);

  // For applying conditional styles to answer choices.
  const [StyleButton1, SetStyleButton1] = useState<any>(styles.choice);
  const [StyleButton2, SetStyleButton2] = useState<any>(styles.choice);
  const [StyleButton3, SetStyleButton3] = useState<any>(styles.choice);
  const [StyleButton4, SetStyleButton4] = useState<any>(styles.choice);

  // For disabling already chosen buttons.
  const [DisableButton1, SetButtonDisable1] = useState(false);
  const [DisableButton2, SetButtonDisable2] = useState(false);
  const [DisableButton3, SetButtonDisable3] = useState(false);
  const [DisableButton4, SetButtonDisable4] = useState(false);

  // randomizes the correct answer location.
  const RandomizeAnswers = () => {
    // Get a random int
    const CorrectAnswerLocation = GetRandomInt();

    // apply the answer choices.
    switch (CorrectAnswerLocation) {
      case 1:
        SetAnswer1(CorrectAnswer);
        SetAnswer2(Incorrect1);
        SetAnswer3(Incorrect2);
        SetAnswer4(Incorrect3);
        break;
      case 2:
        SetAnswer1(Incorrect1);
        SetAnswer2(CorrectAnswer);
        SetAnswer3(Incorrect2);
        SetAnswer4(Incorrect3);
        break;
      case 3:
        SetAnswer1(Incorrect1);
        SetAnswer2(Incorrect2);
        SetAnswer3(CorrectAnswer);
        SetAnswer4(Incorrect3);
        break;
      case 4:
        SetAnswer1(Incorrect1);
        SetAnswer2(Incorrect2);
        SetAnswer3(Incorrect3);
        SetAnswer4(CorrectAnswer);
        break;
    }
  };

  // Generates a random integer.
  const GetRandomInt = () => {
    return Math.floor(Math.random() * (5 - 1) + 1);
  };

  useEffect(() => {
    try {
      // save progress to the database.
      SaveProgress(
        token,
        userCourse.Language,
        CurrentQuestion,
        QuestionsCorrect
      );
      RandomizeAnswers();
    } catch (error) {
      console.log("Failed to save progress. :(");
    }
  }, [CurrentQuestion]);

  const SaveProgress = async (
    UserTokenRaw: string,
    LanguageName: string,
    CurrentQuestion: number,
    NumberCorrect: number
  ) => {
    const data = {
      token: UserTokenRaw,
      userCourses: LanguageName,
      currentQuestion: CurrentQuestion,
      numCorrect: NumberCorrect,
    };

    try {
      const response = await axios.post(
        "http://syntax-sensei-a349ca4c0ed0.herokuapp.com/api/updateProgress",
        data
      );
      console.log("response in saveprogress: ", response.data);
    } catch (error) {
      console.log(error);
      console.log("broke in saveprogress.");
      console.log(UserTokenRaw);
      console.log(LanguageName);
      console.log(CurrentQuestion);
      console.log(NumberCorrect);
    }
  };

  // Disables all buttons.
  const DisableAllButtons = () => {
    SetButtonDisable1(true);
    SetButtonDisable2(true);
    SetButtonDisable3(true);
    SetButtonDisable4(true);
  };

  // Enables all buttons.
  const EnableAllButtons = () => {
    SetButtonDisable1(false);
    SetButtonDisable2(false);
    SetButtonDisable3(false);
    SetButtonDisable4(false);
  };

  // Reveals the correct and incorrect choices when the correct answer is chosen.
  const RevealStyles = (ButtonChosen: number) => {
    switch (ButtonChosen) {
      case 1:
        SetStyleButton1(styles.correctStyle);
        SetStyleButton2(styles.incorrectStyle);
        SetStyleButton3(styles.incorrectStyle);
        SetStyleButton4(styles.incorrectStyle);
        break;
      case 2:
        SetStyleButton1(styles.incorrectStyle);
        SetStyleButton2(styles.correctStyle);
        SetStyleButton3(styles.incorrectStyle);
        SetStyleButton4(styles.incorrectStyle);
        break;
      case 3:
        SetStyleButton1(styles.incorrectStyle);
        SetStyleButton2(styles.incorrectStyle);
        SetStyleButton3(styles.correctStyle);
        SetStyleButton4(styles.incorrectStyle);
        break;
      case 4:
        SetStyleButton1(styles.incorrectStyle);
        SetStyleButton2(styles.incorrectStyle);
        SetStyleButton3(styles.incorrectStyle);
        SetStyleButton4(styles.correctStyle);
        break;
    }
  };

  // Sets all buttons to the default style.
  const ResetButtonStyles = () => {
    console.log("Resetting button styles.");
    SetStyleButton1(styles.choice);
    SetStyleButton2(styles.choice);
    SetStyleButton3(styles.choice);
    SetStyleButton4(styles.choice);
  };

  // Disables and applies incorrect style to incorrect answer choice.
  const DisableIncorrectChoice = (ButtonChosen: number) => {
    switch (ButtonChosen) {
      case 1:
        SetButtonDisable1(true);
        SetStyleButton1(styles.incorrectStyle);
        break;
      case 2:
        SetButtonDisable2(true);
        SetStyleButton2(styles.incorrectStyle);
        break;
      case 3:
        SetButtonDisable3(true);
        SetStyleButton3(styles.incorrectStyle);
        break;
      case 4:
        SetButtonDisable4(true);
        SetStyleButton4(styles.incorrectStyle);
        break;
    }
  };

  const UpdateProgress = () => {
    SetProgress(progress + 10);
  }; // Increments questions answered correctly by 1 if user is on first try.
  const UpdateCorrectQuestions = () => {
    if (Tries == 0) {
      SetQuestionsCorrect(QuestionsCorrect + 1);
    }
  };

  // Increments questions answered incorrectly by 1 if user is on first try.
  const UpdateIncorrectQuestions = () => {
    if (Tries == 0) {
      SetQuestionsIncorrect(QuestionsIncorrect + 1);
    }
  };

  // Restarts the current lesson when all questions have been answered.
  const RestartLesson = (
    token: string,
    Language: string,
    CurrentQuestion: number,
    NumberCorrect: number
  ) => {
    SetProgress(0);
    SetQuestionsCorrect(0);
    SetQuestionsIncorrect(0);
    SetCurrentQuestion(0);
    SetTries(0);
    SetRestartButton(false);
    EnableAllButtons();
    ResetButtonStyles();

    // Save progress to the database.
    try {
      SaveProgress(token, userCourse.Language, CurrentQuestion, NumberCorrect);
    } catch (error) {
      console.log("it broke in restart");
      console.log(error);
    }
  };

  // Handle conditional messages when the correct answer is chosen.
  const HandleCorrectAnswerChoice = (
    ButtonChosen: number,
    QuestionBank: any
  ) => {
    // Disable all buttons
    DisableAllButtons();

    // Apply the correct styles to all buttons revealing incorrect answers.
    RevealStyles(ButtonChosen);

    // Remove other messages if present.
    SetTryAgain(false);

    // If at the end of the lesson.
    if (CurrentQuestion == QuestionBank.length - 1) {
      SetRestartButton(true);
      UpdateProgress();
    } else {
      SetCorrect(true);
      SetNextButton(true);
      SetTries(0);
    }
  };

  // Handle conditional messages when an incorrect answer is chosen.
  const HandleIncorrectAnswerChoice = (
    ButtonChosen: number,
    QuestionBank: any
  ) => {
    // Disable the incorrect button and remove the hover animation.
    DisableIncorrectChoice(ButtonChosen);

    // Disaplay the try again message and increment the try count.
    SetTryAgain(true);
    SetTries(Tries + 1);

    // Check if the user is out of tries for this question.
    if (Tries === 2) {
      DisableAllButtons();

      // If all questions have been answered.
      if (CurrentQuestion == QuestionBank.length - 1) {
        SetRestartButton(true);
        UpdateProgress();
      } else {
        SetTryAgain(false);
        SetIncorrect(true);
        SetNextButton(true);
        SetTries(0);
      }
    }
  };

  // Checks the answer and displays the proper messages.
  const CheckAnswer = (
    ButtonChosen: number,
    CorrectAnswer: number,
    ChosenAnswer: number,
    QuestionBank: any
  ) => {
    console.log(ChosenAnswer);
    console.log(CorrectAnswer);

    // If the correct answer was chosen.
    if (ChosenAnswer === CorrectAnswer) {
      // Increment answers answered correctly.
      UpdateCorrectQuestions();

      // Handle conditional messages.
      HandleCorrectAnswerChoice(ButtonChosen, QuestionBank);
    } else {
      // Update the numbre of incorrectly answered questions.
      UpdateIncorrectQuestions();

      // Handle conditional messages.
      HandleIncorrectAnswerChoice(ButtonChosen, QuestionBank);
    }
  };

  // save progress and go to dashboard
  const HandleDashboardPress = async () => {
    try {
      await SaveProgress(
        token,
        userCourse.Language,
        CurrentQuestion,
        QuestionsCorrect
      );
      console.log("Progress saved in dash hopefully");
      navigation.navigate("landing", {
        refresh: "Refresh, there is new data!",
      });
    } catch (error) {
      console.log("Failed to save progress in dash. :(");
    }
  };

  const HandleLogout = async () => {
    try {
      await SaveProgress(
        token,
        userCourse.Language,
        CurrentQuestion,
        QuestionsCorrect
      );
      navigation.navigate("welcome");
    } catch (error) {
      console.log("Failed to save progress when logging out. :(");
    }
  };

  // Moves to the next question and removes messages.
  const NextQuestion = async (CurrentQuestion: number) => {
    console.log("Current question before inc: ", CurrentQuestion);

    // Increment the current question.
    SetCurrentQuestion(CurrentQuestion + 1);

    EnableAllButtons();

    // Reset all styles.
    SetStyleButton1(styles.choice);
    SetStyleButton2(styles.choice);
    SetStyleButton3(styles.choice);
    SetStyleButton4(styles.choice);

    // Clear messages.
    SetCorrect(false);
    SetIncorrect(false);
    SetTryAgain(false);

    // Remove the next question button
    SetNextButton(false);

    // Update progress bar.
    UpdateProgress();
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "#fa304c" }}>
        <SafeAreaView style={{ flex: 1, flexDirection: "column" }}>
          <View
            style={{
              flex: 1.3,
              backgroundColor: "#fa304c",
              alignItems: "center",
            }}
          >
            <Text style={styles.title}>{Language}</Text>
          </View>
          <View
            style={{
              flex: 10,
              backgroundColor: "white",
              alignItems: "center",
              borderTopRightRadius: 9,
              borderTopLeftRadius: 9,
              borderBottomLeftRadius: 9,
              borderBottomRightRadius: 9,
            }}
          >
            
            <View style={styles.senseiProg}>
                <Image
                    source={require("../assets/images/SenseiCropped.png")}
                    style={styles.image}
                    resizeMode="contain"

                />
                 <View style={{flexDirection:'column',marginTop: 5, paddingLeft: "3%"}}>
                    <Text style={{ marginTop: "15%", fontSize: 15 }}>
                                Correct: {QuestionsCorrect} {"          "}Incorrect:{" "}
                                {QuestionsIncorrect}
                    </Text>  
                    <Progress.Bar
                            color={"#fa304c"}
                            progress={progress / 100}
                            width={200}
                            style={{marginTop:5}}
                    />
                </View>
            </View>

            <View style={styles.questionContainer}>
              <Text style={styles.question}>{QuestionText}</Text>
            </View>

            <View style={{ marginTop: 20 }}>
              <TouchableHighlight
                id="AnswerOne"
                style={StyleButton1}
                onPress={() =>
                  CheckAnswer(1, CorrectAnswer, Answer1, QuestionBank)
                }
                underlayColor="gray"
                disabled={DisableButton1}
              >
                <Text style={styles.choiceText}>{Answer1}</Text>
              </TouchableHighlight>
            </View>
            <View>
              <TouchableHighlight
                id="AnswerTwo"
                style={StyleButton2}
                onPress={() =>
                  CheckAnswer(2, CorrectAnswer, Answer2, QuestionBank)
                }
                underlayColor="gray"
                disabled={DisableButton2}
              >
                <Text style={styles.choiceText}>{Answer2}</Text>
              </TouchableHighlight>
            </View>
            <View>
              <TouchableHighlight
                id="AnswerThree"
                style={StyleButton3}
                onPress={() =>
                  CheckAnswer(3, CorrectAnswer, Answer3, QuestionBank)
                }
                underlayColor="gray"
                disabled={DisableButton3}
              >
                <Text style={styles.choiceText}>{Answer3}</Text>
              </TouchableHighlight>
            </View>
            <View>
              <TouchableHighlight
                id="AnswerFour"
                style={StyleButton4}
                onPress={() =>
                  CheckAnswer(4, CorrectAnswer, Answer4, QuestionBank)
                }
                underlayColor="gray"
                disabled={DisableButton4}
              >
                <Text style={styles.choiceText}>{Answer4}</Text>
              </TouchableHighlight>
            </View>
            <View style={{ marginTop: 30 }}>
              {Correct && <Text style={styles.message}>Correct!</Text>}
              {Incorrect && (
                <Text style={styles.message}>The correct answer was...</Text>
              )}
              {IncorrectTryAgain && (
                <Text style={styles.message}>Incorrect, try again.</Text>
              )}
            </View>

            <View>
              {NextButton && (
                <Pressable style = {styles.nextButton}
                  id="NextQuestionButton"
                  onPress={() => NextQuestion(CurrentQuestion)}
                >
                  <Text>Next Question</Text>
                </Pressable>
              )}

              {RestartButton && (
                <Pressable style = {styles.nextButton}
                  id="RestartButton"
                  onPress={() => RestartLesson(token, Language, 0, 0)}
                >
                  <Text>Restart Lesson</Text>
                </Pressable>
              )}
            </View>
          </View>

          <View style={[{ backgroundColor: "#fa304c" }, styles.container]}>
            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "#fa304c" : "white",
                  
                },
                styles.dashboardButton,styles.boxWithShadow
              ]}
              onPress={HandleDashboardPress}
            >
              <Text style={styles.buttonText}>Dashboard</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "gray" : "white",
                },
                styles.logoutButton,styles.boxWithShadow
              ]}
              onPress={HandleLogout}
            >
              <Text style={styles.buttonText}>Logout</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1.3,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "black",
    textShadowRadius: 5,
    marginTop: "4%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  question: {
    fontSize: 20,
    marginBottom: 20,
  },
  choice: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#222",
    borderRadius: 8,
    marginVertical: 10,
    width: 350,

  },
  correctStyle: {
    backgroundColor: "#38b031",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#222",
    borderRadius: 8,
    marginVertical: 10,
    width: 350,
  },
  incorrectStyle: {
    backgroundColor: "#fa304c",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#222",
    borderRadius: 8,
    marginVertical: 10,
    width: 350,
  },
  dashboardButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop:"5%",
  },
  logoutButton: {
    paddingHorizontal: 30,
    paddingVertical: 8,
    marginLeft: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop:"5%",
  },
  choiceText: {
    fontSize: 16,
    color: "#333",
  },
  buttonText: {
    fontSize: 20,
    color: "#fa304c",
    fontWeight: "bold",
  },
  questionContainer: {
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingTop: 15,
    marginTop: 30,
    alignItems: 'center',
  },
  message: {
    fontSize: 20,
    fontWeight: "bold",
  },
  nextButton:{
    paddingVertical: "2%",
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: "2%",

  },

  boxWithShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    elevation: 5,
    shadowRadius: 2,
    shadowOpacity: 0.8,
  },  
  image: {
    width: 70, // Adjust the width as needed
    height: 80, // Adjust the height as needed
    marginTop: "5%",
    paddingRight: "30%",

  },
  senseiProg: {
    flexDirection: 'row',
    marginTop:"2%",
    marginLeft: 0,
    marginRight: "10%",
  },

  

});

export default Questions;

// <SafeAreaView style={{ flex: 1 }}>
//   <View style={styles.container}>
//     <Text style={styles.question}>{questionData.question}</Text>
//     {questionData.choices.map((choice) => (
// <TouchableHighlight
//   key={choice.id}
//   style={styles.choice}
//   onPress={() => handleSelectChoice(choice.id)}
//   underlayColor="green"
// >
//   <Text style={styles.choiceText}>{choice.text}</Text>
// </TouchableHighlight>
//     ))}
//   </View>

//   <Pressable onPress={() => navigation.navigate("login")}>
//     <Text style={{ color: "black", fontSize: 17, fontWeight: "bold" }}>
//       Logout
//     </Text>
//   </Pressable>
//   <Pressable onPress={() => navigation.goBack()}>
//     <Text style={{ color: "black", fontSize: 17, fontWeight: "bold" }}>
//       Dashboard
//     </Text>
//   </Pressable>
// </SafeAreaView>
