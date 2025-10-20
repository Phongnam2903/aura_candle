const { Address } = require("../../models");


//  Create
const createAddress = async (req, res) => {
    try {
        const { user, specificAddress, isDefault } = req.body;

        if (isDefault) {
            await Address.updateMany({ user }, { isDefault: false });
        }

        const newAddress = new Address({ user, specificAddress, isDefault });
        await newAddress.save();

        res.status(201).json(newAddress);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//  Get all addresses of a user
const getAddressesByUser = async (req, res) => {
    try {
        const addresses = await Address.find({ user: req.params.userId });
        res.json(addresses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//  Get single address
const getAddressById = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);
        if (!address) return res.status(404).json({ message: "Address not found" });
        res.json(address);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//  Update
const updateAddress = async (req, res) => {
    try {
        const { specificAddress, isDefault } = req.body;

        const address = await Address.findById(req.params.id);
        if (!address) return res.status(404).json({ message: "Address not found" });

        if (specificAddress) address.specificAddress = specificAddress;

        if (isDefault !== undefined) {
            if (isDefault) {
                await Address.updateMany({ user: address.user }, { isDefault: false });
            }
            address.isDefault = isDefault;
        }

        await address.save();
        res.json(address);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//  Delete
const deleteAddress = async (req, res) => {
    try {
        const address = await Address.findByIdAndDelete(req.params.id);
        if (!address) return res.status(404).json({ message: "Address not found" });
        res.json({ message: "Address deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createAddress,
    getAddressesByUser,
    getAddressById,
    updateAddress,
    deleteAddress
};
