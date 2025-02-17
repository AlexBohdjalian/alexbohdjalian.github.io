---
title: "Exploring Structured Output with MoolaMate"
categories: Blog
tags:
  - Laravel
  - AI
  - React
  - OpenAI
  - Web Development
excerpt: >-
  A deep dive into Structured Output, by implementing a project that combines React and Laravel to manage transactions with AI-powered insights.
---

## Introduction

Not long ago, I had an idea for a project that got put on hold as I was unsure of the best approach. However, after attending the brilliant lecture [_React Server Components in AI Applications_](https://gitnation.com/contents/react-server-components-in-ai-applications){:target="\_blank"} by Tejas Kumar, I was re-motivated to pick up where I left off and achieve my goals for this project.

## Motivation

Being a bit of a fitness fanatic, I've used more than my fair share of workout planning and diet tracking apps. After using [MacroFactor](https://macrofactorapp.com/){:target="\_blank"} (which I highly recommend), I was fascinated by their **_AI Describe Feature_**.

<p
  align="center"
>
  <img
    src="{{ site.url }}{{ site.baseurl }}/assets/images/marcofactor_ai_describe.png"
    alt="Macro Factor AI Describe Feature Screenshot"
    width="300px"
  >
</p>

The concept is simple: users describe in plain English what foods they would like to add to their diary, along with their quantities and the app generates a summary of what you told it, as if you had manually input each item. This is a real time saver!

After studying Natural Language Processing at University, my mind immediately went to how a task like this would be achieved. The techniques I was aware of however were far from being well suited. Being a fan of what ChatGPT (and similar LLMs) are capable of, I wondered if it would be possible to tailor a model to extract and transform the data into a required format. While this approach seemed promising, I knew that the non-deterministic nature of LLMs and the lack of strictness on their output would be a problem.

Then, I discovered **Structured-Output**!

Simply put, Structured Output is a feature available on [OpenAI's Assistant API](https://platform.openai.com/docs/assistants/overview){:target="\_blank"} (and some of their other APIs) that ensures the output adheres to a given JSON Schema. Combined with Assistants - models with initial instructions, context, function calling abilities and more - it seemed like the task of taking some messy user input and transforming into something usable was possible!

## Project Goals

First, the key to any successful personal project, a good name. Instead of a nutrition tracking app, I wanted to have a go at implementing my own expense tracking web app. The ultimate aim being that you would be able to view how your money is spent, and what categories each expense falls under. With this in mind, a quick description of my project to ChatGPT yielded the name **_MoolaMate_**.

Onto the technical stuff. I had several key objectives:

- Robust API interaction: Improve my ability to interact with APIs efficiently and handle different and unexpected responses.
- Customising an OpenAI Assistant: Experiment with tailoring an LLM to better fit my specific needs.
- Working with structured output: Gain experience using OpenAI's structured output feature.
- Dynamic UI Generation: Inspired by Tejas Kumar's talk, explore ways to generate UI components dynamically based on the structured data.
- Improving my Laravel Skills: Strengthen my backend development skills.

## How did it all go

### Frontend

The frontend of this project was not my primary focus; something which gets the job done was good enough for me. Given this, below is what I managed to whip up, a textarea to enter your transaction info and a table with all of the transactions that are yet to be 'confirmed' (more or on that later).

![MoolaMate Dashboard Example]({{ site.url }}{{ site.baseurl }}/assets/images/moolamate-dashboard-tab.png)

Once transactions have been edited, confirmed or deleted, they will appear in the transactions tab. This is to ensure any potentially inaccurate information isn't accidentally leaked into the confirmed transactions, affecting the users data.

The transactions tab contains a table of info for transactions and a small pie chart showing the distrubution of purchases based on categories.

<!-- TODO: redo this image after making the code account for different currencies when adding -->
![MoolaMate Dashboard Example]({{ site.url }}{{ site.baseurl }}/assets/images/moolamate-transactions-tab.png)

If I were to redo this project, I would probably avoid using AG Grid, as it added an extra level of unnecessary complexity for this project, which resulted in far too much wasted time just trying to get the tables to look nice 🥲.

### Backend

Bleep bloop

<!-- ## Challenges and Learnings

### API Integration

Integrating with OpenAI's Assistant API presented several challenges, including handling authentication, managing request payloads, and processing responses. Overcoming these challenges provided valuable insights into API integration best practices.

### Web Development

Building a full-stack application with React and Laravel required a deep understanding of both frontend and backend development. This project reinforced the importance of clean code, modular design, and efficient state management.

## Conclusion

MoolaMate is more than just a personal project; it's a comprehensive learning experience that bridges the gap between theoretical knowledge and practical application. By integrating OpenAI's Assistant API, the project not only enhances transaction management but also showcases the potential of AI-powered features in modern web development.

## Future Work

### Enhancements

- **User Authentication**: Implementing secure user authentication and authorization.
- **Advanced Analytics**: Adding more advanced analytics and reporting features.
- **Mobile Support**: Developing a mobile-friendly version of the application.

### Community Involvement

- **Open Source**: Considering open-sourcing the project to invite contributions and feedback from the developer community.
- **Documentation**: Improving documentation to help others understand and contribute to the project.

## Final Thoughts

MoolaMate represents a significant step in the journey of learning and growth. By tackling real-world challenges and integrating cutting-edge technologies, this project serves as a testament to the power of hands-on experience in mastering new skills. -->
