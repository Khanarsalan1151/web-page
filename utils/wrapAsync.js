module.exports = (fn) => {
    return (req,res,next) => {
        fn(req,res,next).catch(next);
    }
}

// IDhr .catch(next aayega ki next middleware kya higa but mene err pass kr rkha tha argument mein isliye vo error is==he catch kr rha tha)