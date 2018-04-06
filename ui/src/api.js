export const fetchDonors = (startAt, count) => {
    return fetch(`/donors/?limit=${count}&offset=${startAt}`)
        .then(res => res.json())
}
