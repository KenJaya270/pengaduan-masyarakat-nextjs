import { Keluhan } from '@/types/keluhan.types';
import Link from 'next/link';
import { Fragment } from 'react';

// interface KeluhanListProps extends Keluhan {
//     onClick: () => void;
//     complaints: 
// }

interface KeluhanListProps {
    complaints: Keluhan[];
    clickList: (complaint: Keluhan) => () => void
}

export default function KeluhanList({ 
    // judul, 
    // created_at, 
    // status, 
    // description, 
    // onClick ,
    complaints,
    clickList
}: KeluhanListProps) {
    return (

        
    <Fragment>
        {complaints.map(complaint => {

        return <div key={complaint.id} className='space-y-6 w-3/5'>
            <div className="cursor-pointer" onClick={() => clickList(complaint)}>
                <div className="group">
                    <Link href="#" className="text-xl text-blue-800 hover:underline font-medium mb-1 block">
                        {complaint.judul}
                    </Link>
                    <div className="text-sm text-gray-600 mb-2">
                        <span className="text-gray-500">{   }</span> —
                        <span className="ml-2">
                            Status: <span className={
                                complaint.status === 'Pending' ? 'text-red-500' : 
                                complaint.status === 'On Progress' ? 'text-yellow-500' : 
                                'text-green-500'
                            }>
                                {complaint.status}
                            </span>
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1 line-clamp-2 max-w-2xl overflow-hidden">
                        {complaint.description}
                    </p>
                </div>
            </div>
        </div>
        })}
    </Fragment>

    )
}