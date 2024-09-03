const CreditTransactionRecord = ({record}) => {
    switch (record.usageType.toUpperCase()) {
        case 'PROGRAM':
            return (<div>You have spent {record.credits} credit(s) on {record.program ? (<a href={`/programs/${record.program.id}`}>{record.program.name}</a>) : <span style={{color: 'lightgray'}}>[Program Deleted]</span>}</div>);
        case 'TRANSFER':
            return (<div>You have transfered {record.credits} credit(s) to {record.recipientUser ? (<span>{record.recipientUser.name} <span style={{color: 'gray', fontWeight: '400', marginLeft: '4px'}}>({record.recipientUser.email})</span></span>) : <span style={{color: 'lightgray'}}>[User Deleted]</span>}</div>);
        case 'REVERT':
            return (<div>{record.credits} credit(s) have been reverted to your account</div>);
    }
}

export default CreditTransactionRecord;
