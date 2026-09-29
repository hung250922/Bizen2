import { confirmAlert } from 'react-confirm-alert';
import "react-confirm-alert/src/react-confirm-alert.css";
import moment from 'moment';

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// export const formatter = new Intl.NumberFormat(undefined, {
//     style: "currency",
//     currency: null,
//     minimumFractionDigits: 2
// })

export const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0
})

export const confirmChoice = (message, callback) => {
    confirmAlert({
        customUI: ({ onClose }) => {
            return (
                <div className='custom-ui'>
                    <div className='heading'>{message}</div>
                    <div>
                        <button className='yes' onClick={
                            () => {
                                onClose()
                                if(callback) callback()
                            }
                        }>Đồng ý</button>
                        <button className='cancel' onClick={onClose}>Huỷ</button>
                    </div>
                </div>
            )
        },
        closeOnClickOutside: false
    });
}

export const convertToValueNumber = (value) => {
    if (typeof value === "string") {
        value = value.replace(/\./g,'').replace(',','.');
        value = parseFloat(value);
    }
    return value;
}

export const countDaysInMonth = (year, month, dateNumber) => {
    let count = 0;
    const startOfMonth = moment({ year, month }).startOf('month');
    const endOfMonth = moment(startOfMonth).endOf('month');

    while (startOfMonth.isSameOrBefore(endOfMonth)) {
        if (startOfMonth.day() === dateNumber) { // 1 represents Monday
            count++;
        }
        startOfMonth.add(1, 'day');
    }

    return count;
}