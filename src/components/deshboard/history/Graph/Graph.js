import React from 'react'
import {Bar} from 'react-chartjs-2'
export default function MyChart() {

    let data={
        labels:['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30'],
        datasets:[
            {
                label: 'sales in 2020',
                data:[10,20,5,6,450,1000,100],
                backgroundColor:'#3498db'
            }
        ]
    }

    return (
        <div>
            <Bar data={data}/>
        </div>
    )
}