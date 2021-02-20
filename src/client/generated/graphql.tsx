import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: string;
};

export type Query = {
  __typename?: 'Query';
  getActiveRooms: Array<Room>;
  getRoomById: Room;
  me: User;
};


export type QueryGetActiveRoomsArgs = {
  courseCode: Scalars['String'];
};


export type QueryGetRoomByIdArgs = {
  roomId: Scalars['String'];
};

export type Room = {
  __typename?: 'Room';
  id: Scalars['String'];
  name: Scalars['String'];
  capacity: Scalars['Int'];
  enforceCapacity: Scalars['Boolean'];
  manuallyDisabled: Scalars['Boolean'];
  activeTimes: Array<WeeklyEvent>;
  queues: Array<Queue>;
  course: Course;
};

export type WeeklyEvent = {
  __typename?: 'WeeklyEvent';
  id: Scalars['Float'];
  startTime: Scalars['Float'];
  endTime: Scalars['Float'];
  day: Scalars['Int'];
  room: Room;
};

export type Queue = {
  __typename?: 'Queue';
  id: Scalars['String'];
  examples: Array<Scalars['String']>;
  theme: QueueTheme;
  sortedBy: QueueSortType;
  actions: Array<QueueAction>;
  room: Room;
  questions: Array<Question>;
  clearAfterMidnight: Scalars['Boolean'];
  lastAccessed: Scalars['DateTime'];
};

export enum QueueTheme {
  Gray = 'GRAY',
  Red = 'RED',
  Orange = 'ORANGE',
  Yellow = 'YELLOW',
  Green = 'GREEN',
  Teal = 'TEAL',
  Blue = 'BLUE',
  Cyan = 'CYAN',
  Purple = 'PURPLE',
  Pink = 'PINK'
}

export enum QueueSortType {
  Time = 'TIME',
  Questions = 'QUESTIONS',
  QuestionsAndTime = 'QUESTIONS_AND_TIME'
}

export enum QueueAction {
  Claim = 'CLAIM',
  Accept = 'ACCEPT',
  Remove = 'REMOVE',
  Email = 'EMAIL'
}

export type Question = {
  __typename?: 'Question';
  id: Scalars['String'];
  status: QuestionStatus;
  op: User;
  claimer?: Maybe<User>;
  createdTime: Scalars['DateTime'];
  claimTime?: Maybe<Scalars['DateTime']>;
  claimMessage?: Maybe<Scalars['String']>;
  queue: Queue;
};

export enum QuestionStatus {
  Open = 'OPEN',
  Claimed = 'CLAIMED',
  Closed = 'CLOSED',
  Accepted = 'ACCEPTED'
}

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  username: Scalars['String'];
  name: Scalars['String'];
  email: Scalars['String'];
  isOnline: Scalars['Boolean'];
  isAdmin: Scalars['Boolean'];
  courseStaff: Array<CourseStaff>;
  questions: Array<Question>;
  claimedQuestions: Array<Question>;
  courseMetas: Array<CourseUserMeta>;
};

export type CourseStaff = {
  __typename?: 'CourseStaff';
  id: Scalars['String'];
  role: StaffRole;
  user: User;
  course: Course;
};

export enum StaffRole {
  Staff = 'STAFF',
  Coordinator = 'COORDINATOR'
}

export type Course = {
  __typename?: 'Course';
  id: Scalars['String'];
  code: Scalars['String'];
  title: Scalars['String'];
  courseStaff: Array<CourseStaff>;
  userMetas: Array<CourseUserMeta>;
  rooms: Array<Room>;
};

export type CourseUserMeta = {
  __typename?: 'CourseUserMeta';
  id: Scalars['String'];
  user: User;
  course: Course;
  questionsAsked: Scalars['Int'];
  enrolledSession?: Maybe<Scalars['String']>;
};


export type Mutation = {
  __typename?: 'Mutation';
  askQuestion: Question;
  removeQuestion: Question;
  createCourse: Course;
  addStaff: Array<CourseStaff>;
};


export type MutationAskQuestionArgs = {
  queueId: Scalars['String'];
};


export type MutationRemoveQuestionArgs = {
  message?: Maybe<Scalars['String']>;
  questionId: Scalars['String'];
  questionStatus: QuestionStatus;
};


export type MutationCreateCourseArgs = {
  courseInput: CourseInput;
};


export type MutationAddStaffArgs = {
  role: StaffRole;
  usernames: Array<Scalars['String']>;
  courseId: Scalars['String'];
};

export type CourseInput = {
  code: Scalars['String'];
  title: Scalars['String'];
};

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'name'>
    & { courseStaff: Array<(
      { __typename?: 'CourseStaff' }
      & Pick<CourseStaff, 'role'>
      & { course: (
        { __typename?: 'Course' }
        & Pick<Course, 'code'>
      ) }
    )> }
  ) }
);

export type GetActiveRoomsQueryVariables = Exact<{
  courseCode: Scalars['String'];
}>;


export type GetActiveRoomsQuery = (
  { __typename?: 'Query' }
  & { getActiveRooms: Array<(
    { __typename?: 'Room' }
    & Pick<Room, 'id'>
  )> }
);


export const MeDocument = gql`
    query Me {
  me {
    id
    username
    name
    courseStaff {
      course {
        code
      }
      role
    }
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const GetActiveRoomsDocument = gql`
    query GetActiveRooms($courseCode: String!) {
  getActiveRooms(courseCode: $courseCode) {
    id
  }
}
    `;

/**
 * __useGetActiveRoomsQuery__
 *
 * To run a query within a React component, call `useGetActiveRoomsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetActiveRoomsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetActiveRoomsQuery({
 *   variables: {
 *      courseCode: // value for 'courseCode'
 *   },
 * });
 */
export function useGetActiveRoomsQuery(baseOptions: Apollo.QueryHookOptions<GetActiveRoomsQuery, GetActiveRoomsQueryVariables>) {
        return Apollo.useQuery<GetActiveRoomsQuery, GetActiveRoomsQueryVariables>(GetActiveRoomsDocument, baseOptions);
      }
export function useGetActiveRoomsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetActiveRoomsQuery, GetActiveRoomsQueryVariables>) {
          return Apollo.useLazyQuery<GetActiveRoomsQuery, GetActiveRoomsQueryVariables>(GetActiveRoomsDocument, baseOptions);
        }
export type GetActiveRoomsQueryHookResult = ReturnType<typeof useGetActiveRoomsQuery>;
export type GetActiveRoomsLazyQueryHookResult = ReturnType<typeof useGetActiveRoomsLazyQuery>;
export type GetActiveRoomsQueryResult = Apollo.QueryResult<GetActiveRoomsQuery, GetActiveRoomsQueryVariables>;