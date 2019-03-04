module.exports = async function (context, myBlob) {

    if (!context.bindingData.name.includes('-Result')) {

        let text = myBlob.toString();
        let words = text.split(' ');
        let numberOfWords = words.length;

        context.bindings.myOutputBlob = '{"words":' + numberOfWords + '}';
        context.done();
    }

};