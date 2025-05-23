import { Request, Response } from "express";
import {
  createProduct,
  getProductById,
  handleDeleteProduct,
  updateProductById,
} from "services/admin/product.service";
import {
  ProductSchema,
  TypeProductSchema,
} from "src/validation/product.schema";

const getAdminCreateProductPage = (req: Request, res: Response) => {
  const errors = [];
  const oldData = {
    name: "",
    price: 0,
    detailDesc: "",
    shortDesc: "",
    quantity: 0,
    factory: "",
    target: "",
  };

  return res.render("admin/product/create", { errors, oldData });
};

const postAdminCreateProduct = async (req: Request, res: Response) => {
  const { name, price, detailDesc, shortDesc, quantity, factory, target } =
    req.body as TypeProductSchema;

  const validate = ProductSchema.safeParse(req.body);

  if (!validate.success) {
    // error
    const errorsZod = validate.error.issues;
    const errors = errorsZod?.map(
      (item) => `${item.message} (${item.path[0]})`
    );

    const oldData = {
      name,
      price,
      detailDesc,
      shortDesc,
      quantity,
      factory,
      target,
    };

    return res.render("admin/product/create", { errors, oldData });
  }

  // success
  const image = req?.file?.filename ?? null;
  await createProduct(
    name,
    +price,
    detailDesc,
    shortDesc,
    +quantity,
    factory,
    target,
    image
  );

  return res.redirect("/admin/product");
};

const postDeleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  await handleDeleteProduct(+id);

  return res.redirect("/admin/product");
};

const getViewProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await getProductById(+id);

  const factoryOptions = [
    { name: "Apple (MacBook)", value: "APPLE" },
    { name: "Asus", value: "ASUS" },
    { name: "Lenovo", value: "LENOVO" },
    { name: "Dell", value: "DELL" },
    { name: "LG", value: "LG" },
    { name: "Acer", value: "ACER" },
  ];

  const targetOptions = [
    { name: "Gaming", value: "GAMING" },
    { name: "Sinh viên - Văn phòng", value: "SINHVIEN-VANPHONG" },
    { name: "Thiết kế đồ họa", value: "THIET-KE-DO-HOA" },
    { name: "Mỏng nhẹ", value: "MONG-NHE" },
    { name: "Doanh nhân", value: "DOANH-NHAN" },
  ];

  return res.render("admin/product/detail", {
    product,
    factoryOptions,
    targetOptions,
  });
};

const postUpdateProduct = async (req: Request, res: Response) => {
  const { id, name, price, detailDesc, shortDesc, quantity, factory, target } =
    req.body as TypeProductSchema;

  const image = req?.file?.filename ?? null;

  await updateProductById(
    +id,
    name,
    +price,
    detailDesc,
    shortDesc,
    +quantity,
    factory,
    target,
    image
  );

  return res.redirect("/admin/product");
};

export {
  getAdminCreateProductPage,
  getViewProduct,
  postAdminCreateProduct,
  postDeleteProduct,
  postUpdateProduct,
};
