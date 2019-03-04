module.exports = async function (context, req) {

    if (req.body && req.body.data) {

        let input = req.body.data.toString();
        let words = input.split(' ');
        let numberOfWords = words.length;

        context.res = {
            body: JSON.stringify({words: numberOfWords}),
            headers: {
                'Content-Type': 'application/json'
            }
        };
    } else {
        context.res = {
            status: 400,
            body: 'Please pass data in the request body'
        };
    }
};