module.exports = async function (context, req) {

    /* 
    TODO: put your code here
    You can basically do anything you want,
    but please leave the return statement header
    and the success field as it is.
    */

    context.res = {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            success: true,
            payload: {
                "test": "custom test"
            }
        })
      };
};