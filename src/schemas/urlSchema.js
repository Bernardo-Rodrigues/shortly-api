import joi from 'joi';

const urlSchema = joi.object({
  link: joi.string().uri().required()
});

export default urlSchema;