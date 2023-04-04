// Import du modèle student
var Order = require("../models/order");

// Import de express-validator
const { param, body, validationResult } = require("express-validator");

// Déterminer les règles de validation de la requête
const orderValidationRules = () => {
  return [
    body("orderContent")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Order Content must be specified."),
  ];
};

const paramIdValidationRule = () => {
  return [
    param("id")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Id must be specified.")
      .isNumeric()
      .withMessage("Id must be a number."),
  ];
};

const bodyIdValidationRule = () => {
  return [
    body("id")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Id must be specified.")
      .isNumeric()
      .withMessage("Id must be a number."),
  ];
};

// Méthode de vérification de la conformité de la requête
const checkValidity = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(400).json({
    errors: extractedErrors,
  });
};

// Create
exports.create = [
  bodyIdValidationRule(),
  orderValidationRules(),
  checkValidity,
  (req, res, next) => {
    // Création de la nouvelle instance de student à ajouter
    var order = new Order({
      _id: req.body.id,
      orderContent: req.body.orderContent,
      client: req.body.client,
    });

    // Ajout de student dans la bdd
    order.save(function (err) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(201).json("Order created successfully !");
    });
  },
];

// Read
exports.getAll = (req, res, next) => {
  Order.find()
    .populate("client")
    .exec(function (err, result) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json(result);
    });
};

exports.getById = [
  paramIdValidationRule(),
  checkValidity,
  (req, res, next) => {
    Order.findById(req.params.id)
      .populate("client")
      .exec(function (err, result) {
        if (err) {
          return res.status(500).json(err);
        }
        return res.status(200).json(result);
      });
  },
];

// Update
exports.update = [
  paramIdValidationRule(),
  orderValidationRules(),
  checkValidity,
  (req, res, next) => {
    // Création de la nouvelle instance de student à modifier
    var order = new Order({
      _id: req.body.id,
      orderContent: req.body.orderContent,
      client: req.body.client,
    });

    Order.findByIdAndUpdate(req.params.id, order, function (err, result) {
      if (err) {
        return res.status(500).json(err);
      }
      if (!result) {
        res
          .status(404)
          .json("Order with id " + req.params.id + " is not found !");
      }
      return res.status(201).json("Order updated successfully !");
    });
  },
];

// Delete
exports.delete = [
  paramIdValidationRule(),
  checkValidity,
  (req, res, next) => {
    Order.findByIdAndRemove(req.params.id).exec(function (err, result) {
      if (err) {
        return res.status(500).json(err);
      }
      if (!result) {
        res
          .status(404)
          .json("Order with id " + req.params.id + " is not found !");
      }
      return res.status(200).json("Order deleted successfully !");
    });
  },
];
