import { H3Event } from "h3";
import { createUser, createUserInput } from "~/server/app/userService";

export default eventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const createUserInput: createUserInput = {
    username: body.username,
    password: body.password,
    email: body.email,
    phone: body.phone,
    firstname: body.firstname,
    lastname: body.lastname,
    address: body.address,
    city: body.city,
    country: body.country,
    postalCode: body.postalCode,
    profession: body.profession,
  };
  return await createUser(createUserInput);
});
