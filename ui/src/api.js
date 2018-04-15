export const fetchDonors = (startAt, count) => {
    return fetch(`/donors/?limit=${count}&offset=${startAt}`)
        .then(res => res.json())
}

export const fetchDonorBySerial = id => fetch(`/donor/${id}`)
