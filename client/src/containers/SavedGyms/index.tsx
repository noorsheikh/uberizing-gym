import React from 'react';

import { Container, Row, Col } from 'react-bootstrap';

import { CurrentUserState } from '../../reducers/auth';
import { User } from '../../models/User';

import './SavedGyms.scss';

interface SGProps {
    currentUser?: CurrentUserState;
}

interface SGState {
    currentUser?: CurrentUserState;
    user?: User;
}

class SavedGyms extends React.Component<SGProps, SGState> {
    state = {
        user: {} as User
    };

    render() {
        const user = {...this.state.user};
        return (
            <Container>
                Saved Gyms
            </Container>
        )
    }
}

export default SavedGyms;