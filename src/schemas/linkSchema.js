import joi from 'joi';

const linkSchema = joi.object({
  link: joi.string().uri().required()
});

export default linkSchema;