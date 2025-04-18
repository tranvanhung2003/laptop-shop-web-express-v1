import { Request, Response } from "express";
import {
  getAllUsers,
  handleCreateUser,
  handleDeleteUser,
  getUserById,
  updateUserById,
  getAllRoles,
} from "services/user.service";

const getHomePage = async (req: Request, res: Response) => {
  const users = await getAllUsers();

  return res.render("home", { users: users });
};

const getCreateUserPage = async (req: Request, res: Response) => {
  const roles = await getAllRoles();

  return res.render("admin/user/create", { roles: roles });
};

const postCreateUser = async (req: Request, res: Response) => {
  const { fullName, email, address } = req.body;

  await handleCreateUser(fullName, email, address);

  return res.redirect("/");
};

const postDeleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  await handleDeleteUser(id);

  return res.redirect("/");
};

const getViewUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  // get user by id
  const user = await getUserById(id);

  return res.render("view-user", { id: id, user: user });
};

const postUpdateUser = async (req: Request, res: Response) => {
  const { id, fullName, email, address } = req.body;

  // update user by id
  await updateUserById(id, fullName, email, address);

  return res.redirect("/");
};

export {
  getHomePage,
  getCreateUserPage,
  postCreateUser,
  postDeleteUser,
  getViewUser,
  postUpdateUser,
};
