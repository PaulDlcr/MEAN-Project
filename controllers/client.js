// Import du modèle student
var Client = require("../models/client");

// Import de express-validator
const { param, body, validationResult } = require("express-validator");

// Déterminer les règles de validation de la requête
const clientValidationRules = () => {
  return [
    body("firstName")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("First name must be specified.")
      .isAlphanumeric()
      .withMessage("First name has non-alphanumeric characters."),

    body("lastName")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Last name must be specified.")
      .isAlphanumeric()
      .withMessage("Last name has non-alphanumeric characters."),
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
  clientValidationRules(),
  checkValidity,
  (req, res, next) => {
    // Création de la nouvelle instance de student à ajouter
    var client = new Client({
      _id: req.body.id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      orders: req.body.orders,
    });

    // Ajout de student dans la bdd
    client.save(function (err) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(201).json("Client created successfully !");
    });
  },
];

// Read
exports.getAll = (req, res, next) => {
  Client.find()
    .populate("orders")
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
    Client.findById(req.params.id)
      .populate("orders")
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
  clientValidationRules(),
  checkValidity,
  (req, res, next) => {
    // Création de la nouvelle instance de student à modifier
    var client = new Client({
      _id: req.params.id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      orders: req.body.orders,
    });

    Client.findByIdAndUpdate(req.params.id, client, function (err, result) {
      if (err) {
        return res.status(500).json(err);
      }
      if (!result) {
        res
          .status(404)
          .json("Client with id " + req.params.id + " is not found !");
      }
      return res.status(201).json("Client updated successfully !");
    });
  },
];

// Delete
exports.delete = [
  paramIdValidationRule(),
  checkValidity,
  (req, res, next) => {
    Client.findByIdAndRemove(req.params.id).exec(function (err, result) {
      if (err) {
        return res.status(500).json(err);
      }
      if (!result) {
        res
          .status(404)
          .json("Client with id " + req.params.id + " is not found !");
      }
      return res.status(200).json("Client deleted successfully !");
    });
  },
];
