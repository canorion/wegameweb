import { validationResult } from "express-validator";

const Validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) { return res.status(422).jsonp(errors.array()); }
    
    next();
};
export default Validate;

