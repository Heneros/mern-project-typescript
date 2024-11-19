import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
    title: Yup.string().max(50, 'Max 50 characters').required('Title required'),
    category: Yup.string().required('Category required'),
    description: Yup.string(),
    preview: Yup.string(),
    bedrooms: Yup.number().required('Empty field'),
    bathrooms: Yup.number().required('Empty field'),
    area: Yup.string(),
    price: Yup.number().required('Empty field'),
    floor: Yup.number().required('Empty field'),
    parking: Yup.string().required('Empty field'),
    city: Yup.string().required('Empty field'),
    country: Yup.string().required('Empty field'),
    questionsAndAnswers: Yup.array().of(
        Yup.object().shape({
            question: Yup.string(),
            answer: Yup.string(),
        }),
    ),
});
