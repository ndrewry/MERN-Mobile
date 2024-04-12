import {
    Pressable,
    Text,
    StyleSheet,
    Image,
    SafeAreaView,
    View,
    TouchableHighlight,
} 
from "react-native";
import { useEffect, useState } from 'react';
import { Link } from "expo-router";
import React from "react";
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
  


const Questions: React.FC = () => {
    const [questionData, setQuestionData, ] = useState<Question | null>(null);

    useEffect(() => {
        fetchQuestionData();
    }, []);

    const fetchQuestionData = async () => {
        try {
            // Make API call to fetch question data
            const response = await fetch('your_api_endpoint_here');
            const data = await response.json();
            setQuestionData(data);
        } 
        catch (error) {
            console.error('Error fetching question data:', error);
            // HARDCODED ANSWERS FOR NOW
            setQuestionData({
                id: 1,
                question: 'Where do semicolons go?',
                choices: [
                    { id: 1, text: 'The end' },
                    { id: 2, text: 'The beginning' },
                    { id: 3, text: 'The middle' },
                    { id: 4, text: 'Semicolons!?!?!' },
                ],
            });
        }
    };

  const handleSelectChoice = (id: number) => {
    // Handle choice selection
  };

  if (!questionData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
            <Text style={styles.question}>{questionData.question}</Text>
            {questionData.choices.map((choice) => (
            <TouchableHighlight
                key={choice.id}
                style={styles.choice}
                onPress={() => handleSelectChoice(choice.id)}
                underlayColor = 'green'>
                <Text style={styles.choiceText}>{choice.text}</Text>
                
            </TouchableHighlight>
            ))}
        </View>

        <Pressable onPress={() => navigation.navigate("login")}>
        <Text style={{ color: "black", fontSize: 17, fontWeight: "bold" }}>
          Logout
        </Text>
      </Pressable>

      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
      },
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      question: {
        fontSize: 20,
        marginBottom: 20,
      },
      choice: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 10,
      },
      choiceText: {
        fontSize: 16,
        color: '#333',
      },
});
  
export default Questions;
  