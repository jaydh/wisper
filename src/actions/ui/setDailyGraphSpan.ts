export interface SetDailyGraphSpan {
    type: 'SET_DAILY_GRAPH_SPAN';
    min: Date;
    max: Date;
}

export default function setDailyGraphSpan(min: Date, max: Date): SetDailyGraphSpan {
    return {
        type: 'SET_DAILY_GRAPH_SPAN',
        min,
        max
    };
}