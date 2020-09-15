import React from 'react'

import { Chart } from 'react-charts'
export default function MyChart() {
    const data = React.useMemo(
        () => [
            {
                label: 'Series 1',
                data: [{ x: 1, y: 12 }, { x: 3, y: 4 }, { x: 5, y: 7 }]
            },
            {
                label: 'Series 2',
                data: [{ x: 7, y: 6 }, { x: 3, y: 4 }, { x: 5, y: 7 }]
            },

        ],
        []
    )
    const series = React.useMemo(
        () => ({
            showPoints: true
        }),
        []
    )
    const axes = React.useMemo(
        () => [
            { primary: true, type: 'time', position: 'bottom' },
            { type: 'linear', position: 'left' }
        ],
        []
    )

    return (
        <div
            style={{
                width: '100%',
                height: '280px'
            }}
        >
            <Chart curveBasisClosed={true} data={data} axes={axes} series={series} />
        </div>
    )
}