import OmiseFn from 'omise'
import dotenv from 'dotenv'
dotenv.config()

const omise = OmiseFn({
    publicKey: "pkey_test_5l25k6hnm9vsjgl85pu",
    secretKey: "skey_test_5l25k6hnnpq4bkhvy77"
})

export const retrieveCustomer = id => {
    if (!id) return null

    return new Promise((resolve, reject) => {
        omise.customers.retrieve(id, function(err, res) {
        if (res) {
            resolve(res)
        } else {
            resolve(null)
        }
        })
    })
}
export const createCustomer = (email, description, card) => {
    return new Promise((resolve, reject) => {
        omise.customers.create({ email, description, card }, function(err, res) {
        if (res) {
            resolve(res)
        } else {
            resolve(null)
        }
        })
    })
}

export const createChargeCard = (amount, customer) => {
    return new Promise((resolve, reject) => {
        omise.charges.create({ amount, currency: 'thb', customer }, function(
        err,
        res
        ) {
            if (res) {
                resolve(res)
            } else {
                resolve(null)
            }
        })
    })
}

export const createChargeInternetBanking = (amount, source, return_uri) => {
    return new Promise((resolve, reject) => {
        omise.charges.create({ amount, currency: 'thb', source, return_uri }, function(
            err,
            res
        ) {
            if (res) {
                resolve(res)
            } else {
                resolve(null)
            }
        })
    })
}