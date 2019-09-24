module.exports = async function (context, req) {

    context.res = {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            success: true,
            payload: {
                "test": "latency test"
            }
        })
      };

};