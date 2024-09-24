export default async function executeCodeOnJudge0(codeDetails, apiKey) {
    const postUrl = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*';
    const getUrl = 'https://judge0-ce.p.rapidapi.com/submissions/';

    // POST request to submit code
    try {
        const postResponse = await fetch(postUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-rapidapi-key': apiKey,
            },
            body: JSON.stringify({
                "source_code": btoa(codeDetails.codestring),
                "language_id": codeDetails.langId,
                "stdin": btoa(codeDetails.stdin)
            })
        });

        const postResult = await postResponse.json();

        // Destructure the token from the response
        const { token } = postResult;
        console.log(`Token received: ${token}`);

        // Wait for 5 seconds
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // GET request to retrieve the result using the token
        const getResponse = await fetch(`${getUrl}${token}?base64_encoded=true&fields=*`, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': apiKey,
            },
        });

        const getResult = await getResponse.json();

        // Destructure the desired fields from the response
        let { stdout, time, memory, stderr } = getResult;
        console.log(getResult);
        stdout = atob(stdout)
        return {
            stdout,
            time,
            memory,
            stderr,
        };
    } catch (error) {
        console.error('An error occurred:', error);
        return {
            error: 'An error occurred while processing your request',
        };
    }
}



/*
Usage:

const apiKey = '41599ae506msh68285b0f476e7aep1fe9d9jsn13b33e53059e'; 

let s = `
#include <iostream>

int main() {
  std::cout << "Hello, World!";
  return 0;
}
`;

runCode(
{
  "codestring": s,
  "langId": 54,
  "stdin": "",
}, apiKey).then((result) => console.log(result));
*/