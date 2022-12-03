import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix =
    `
Write me some motivation by reading my problem below

Problem:
`

const generateAction = async (req, res) => {
    console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

    const baseCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${basePromptPrefix}${req.body.userInput}`,
        temperature: 0.8,
        max_tokens: 250,
    });

    const basePromptOutput = baseCompletion.data.choices.pop();

    // I build Prompt #2.
    const secondPrompt =
        `
  Make the above motivational content sound more positive

  `

    // I call the OpenAI API a second time with Prompt #2
    const secondPromptCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${secondPrompt}`,
        temperature: 0.9,
        max_tokens: 600,
    });

    // Get the output
    const secondPromptOutput = secondPromptCompletion.data.choices.pop();

    // Send over the Prompt #2's output to our UI instead of Prompt #1's.
    res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;