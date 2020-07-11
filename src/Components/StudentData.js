import React, { Component } from 'react'

export class StudentData extends Component {
    render() {
        return (
            <div>
                <div>Graduation/Senior Year</div>
                    <select name="grad" id="gradYear">
                        <option value={true}>Even Graduation Year</option>
                        <option value={false}>Odd Graduation Year</option>
                    </select>
                <select name="major" id="major">
                    <option value="CS">Computer Science</option>
                    <option value="ME">Mechanical Engineering</option>
                </select>
            </div>
        )
    }
}

export default StudentData
