---
title: "Exploring Structured Output with MoolaMate"
classes: wide
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

Not long ago, I had an idea for a project that would allow you to seamlessly track your expenses via a textfield, not requiring more than a brief description. At first, I was unsure of the best approach. However, after attending the brilliant lecture [_React Server Components in AI Applications_](https://gitnation.com/contents/react-server-components-in-ai-applications){:target="\_blank"} by Tejas Kumar, I was re-motivated to pick up where I left off and achieve my goals for this project.

## Motivation

Being a bit of a fitness fanatic, I've used more than my fair share of workout planning and diet tracking apps. After using [MacroFactor](https://macrofactorapp.com/){:target="\_blank"} (which I highly recommend), I was fascinated by their **_AI Describe Feature_**.

<p
  align="center"
>
  <a
    href="{{ site.url }}{{ site.baseurl }}/assets/images/marcofactor_ai_describe.png"
  >
    <img
      src="{{ site.url }}{{ site.baseurl }}/assets/images/marcofactor_ai_describe.png"
      alt="Macro Factor AI Describe Feature Screenshot"
      width="300px"
    >
  </a>
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

The frontend of this project was not my primary focus; something which gets the job done was good enough for me. Given this, below is what I managed to whip up, a textarea to enter your transaction info and a table with all of the transactions that are yet to be 'confirmed' (more on that later).

[![MoolaMate Dashboard Example]({{ site.url }}{{ site.baseurl }}/assets/images/moolamate-dashboard-tab.png)]({{ site.url }}{{ site.baseurl }}/assets/images/moolamate-dashboard-tab.png)

Once transactions have been edited, confirmed or deleted, they will appear in the transactions tab. This is to ensure any potentially inaccurate information isn't accidentally leaked into the confirmed transactions, affecting the users data.

The transactions tab contains a table of info for transactions and a small pie chart showing the distribution of purchases based on categories.

[![MoolaMate Dashboard Example]({{ site.url }}{{ site.baseurl }}/assets/images/moolamate-transactions-tab.png)]({{ site.url }}{{ site.baseurl }}/assets/images/moolamate-transactions-tab.png)

If I were to redo this project, I would probably avoid using AG Grid, as it added an extra level of unnecessary complexity for this project, which resulted in far too much wasted time just trying to get the tables to look nice 🥲.

### Creating the assistant

For me, the first step of this project was to get the assistant working. OpenAI fortunately have a dashboard where you can configure and test the assistant, before then getting some credentials to interact with it via the API. This is much more convenient than having to configure it via your application and also reduces a lot of overhead in the application, improving performance.

[![OpenAI Assistants Dashboard]({{ site.url }}{{ site.baseurl }}/assets/images/openai_assistants_dashboard.png)]({{ site.url }}{{ site.baseurl }}/assets/images/openai_assistants_dashboard.png)

The documentation tells you that the model takes into account the name of the assistant and even the names of the keys in the JSON schema when determining the output. For this reason, it was worth while putting some thought into these.

For some additional context, there are generally three 'roles' of prompts when it comes to interacting with these models:

- **System**: Provides initial instructions and context to the model, setting the behaviour and tone for the interaction.
- **Assistant**: Represents the responses generated by the AI model, based on the given instructions and user input.
- **User**: Contains the input or queries from the user, which the assistant responds to, following the guidelines set by the system prompt.

Below is the initial system prompt that I gave the model:

```plaintext
You are an expert in structured data extraction, focusing on financial transactions. You will receive unstructured text from users and must extract the information into the following structured format:

Amount: If not explicitly provided, infer the amount from context or symbols. Be intuitive in identifying any amounts.
Currency: If a currency symbol is present, use it to determine the currency. If not, default to 'user_default'. Be intuitive in identifying symbols commonly associated with currencies (e.g., $, €, £). If no amount is present, try to infer the likely currency based on the user's context.
Category: If mentioned, extract any category associated with the transaction.
Description: Extract and summarize any additional text as the description of the transaction.
Transaction date: If the date is not explicitly mentioned, use today's date or infer from context.
Ensure you are thorough in extracting this information, even if parts are missing. Make intelligent guesses based on context.
```

This prompt aims to extract an array of data (JSON objects), each containing the amount, currency, category of purchase, description and transaction date. The above prompt gives brief descriptions of the data that is required and encourages the model to be more intuitive with the data it's given. For example, if I tell the model that I "bought a meal deal", it would be reasonable to assume that the cost is about £4 if not given.

Next, here is the response schema I managed to come up with. Notice how the keys and their descriptions are informing the model on what output is required.

```json
{
  "name": "transaction_response",
  "strict": false,
  "schema": {
    "type": "object",
    "properties": {
      "transactions": {
        "type": "array",
        "description": "A list of transaction items.",
        "items": {
          "type": "object",
          "properties": {
            "amount": {
              "type": "number",
              "description": "The amount of the transaction."
            },
            "currency": {
              "type": "string",
              "description": "The Common Currency Abbreviation of the transaction (3 characters)."
            },
            "category": {
              "type": "string",
              "description": "The category of the transaction.",
              "enum": [
                "Shopping",
                "Bills",
                "Health",
                "Leisure",
                "Subscription",
                "Other"
              ]
            },
            "description": {
              "type": "string",
              "description": "A brief description of the transaction."
            },
            "transaction_date": {
              "type": "string",
              "description": "The date (and time if possible) of the transaction."
            }
          },
          "required": [
            "amount",
            "currency",
            "category",
            "description",
            "transaction_date"
          ],
          "additionalProperties": false
        }
      }
    },
    "required": ["transactions"],
    "additionalProperties": false
  }
}
```

### Backend

The backend for this project was built from [Laravel Sail](https://laravel.com/docs/11.x/sail) (a base Laravel environment with docker setup). I also bootstrapped it with a MySQL DB, Breeze for authentication / React and inertia-js.

Interacting with the API was relatively simple. A stream was first created as follows:

```php
public function processUserInput(string $userInput, User $user): void
{
    $dateTimeContext = 'The date-time is ' . now()->toIso8601String() . PHP_EOL;

    $stream = $this->client
        ->threads()
        ->createAndRunStreamed([
            'assistant_id' => $this->assistantId,
            'thread' => [
                'messages' => [[
                    'role' => 'user',
                    'content' => $dateTimeContext . $userInput,
                ]],
            ],
        ]);

    foreach ($stream as $response) {
        switch ($response->event) {
            case 'thread.message.completed':
                $this->transformExtractedData($response->response->content[0]->text->value, $user);
                break 2;
            // other cases...
        }
    }
}
```

When a `thread.message.completed` event occurs, we take the final output and process it to extract the JSON object. Error handling is also in place to ensure any failed requests are handled and conveyed back to the user appropriately.

Given the prompt `"Yesterday at 3pm I got some food shopping which cost 30.4. Today I paid my energy bill which was 44.32 dollars"`, we can see the following JSON object is produced.

```json
{
  "transactions": [
    {
      "amount": 30.40,
      "currency": "user_default",
      "category": "Shopping",
      "description": "Food shopping",
      "transaction_date": "2025-02-16T15:00:00+00:00"
    },
    {
      "amount": 44.32,
      "currency": "USD",
      "category": "Bills",
      "description": "Energy bill payment",
      "transaction_date": "2024-02-17T18:15:32+00:00"
    }
  ]
}

```

After some validation, on the data, it is stored in a `transactions` table, with `completed_at` set to `NULL`. The user may then edit, delete or confirm the data.

The rest of the functionality on the website is fairly trivial!

## Final thoughts

Overall, I'm quite happy with the outcome of this project. It was a great learning experience, and I managed to achieve most of my initial goals. However, there is always room for improvement. The robustness of the API interactions could have been better and able to handle a wider range of scenarios and edge cases more gracefully.

Additionally, integrating function calling in the assistant, such as fetching the current time, would have been a valuable feature, rather than having to inject that into the start of every prompt. OpenAI's Assistants also allow for data lookup, which could be useful for tasks similar to how MacroFactor might use a dataset of food items. Investigating how to leverage this capability could further enhance the functionality of MoolaMate.
