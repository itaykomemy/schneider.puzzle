export const fetchDonors = (x0, x1, y0, y1) => {
    return fetch(`/donors/${x0}/${x1}/${y0}/${y1}`)
        .then(res => res.json())
}

export const fetchDonorBySerial = id => fetch(`/donor/${id}`)

export const fetchMetaData = () => fetch('/donors/meta').then(res => res.json())