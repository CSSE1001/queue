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
  getCourses: Array<Course>;
  getActiveRooms: Array<Room>;
  getRoomById: Room;
  me: User;
  getCourseStaff: Array<CourseStaff>;
};


export type QueryGetActiveRoomsArgs = {
  courseCode: Scalars['String'];
};


export type QueryGetRoomByIdArgs = {
  roomId: Scalars['String'];
};


export type QueryGetCourseStaffArgs = {
  courseId: Scalars['String'];
};

export type Course = {
  __typename?: 'Course';
  id: Scalars['String'];
  code: Scalars['String'];
  alias?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  courseStaff: Array<CourseStaff>;
  userMetas: Array<CourseUserMeta>;
  rooms: Array<Room>;
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
  getCourseStaff: Array<CourseStaff>;
};

export type Question = {
  __typename?: 'Question';
  id: Scalars['String'];
  status: QuestionStatus;
  op: User;
  claimer?: Maybe<User>;
  createdTime: Scalars['DateTime'];
  claimTime?: Maybe<Scalars['DateTime']>;
  closedTime?: Maybe<Scalars['DateTime']>;
  claimMessage?: Maybe<Scalars['String']>;
  queue: Queue;
  questionsAsked: Scalars['Int'];
  enrolledIn?: Maybe<Scalars['String']>;
};

export enum QuestionStatus {
  Open = 'OPEN',
  Claimed = 'CLAIMED',
  Closed = 'CLOSED',
  Accepted = 'ACCEPTED',
  NotNeeded = 'NOT_NEEDED'
}


export type Queue = {
  __typename?: 'Queue';
  id: Scalars['String'];
  name: Scalars['String'];
  shortDescription: Scalars['String'];
  createdAt: Scalars['DateTime'];
  examples: Array<Scalars['String']>;
  theme: QueueTheme;
  sortedBy: QueueSortType;
  actions: Array<QueueAction>;
  room: Room;
  questions: Array<Question>;
  clearAfterMidnight: Scalars['Boolean'];
  showEnrolledSession: Scalars['Boolean'];
  activeQuestions: Array<Question>;
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
  Email = 'EMAIL',
  MarkNotNeeded = 'MARK_NOT_NEEDED'
}

export type Room = {
  __typename?: 'Room';
  id: Scalars['String'];
  name: Scalars['String'];
  capacity: Scalars['Int'];
  enforceCapacity: Scalars['Boolean'];
  archived: Scalars['Boolean'];
  activeTimes: Array<WeeklyEvent>;
  queues: Array<Queue>;
  course: Course;
  isActive: Scalars['Boolean'];
};

export type WeeklyEvent = {
  __typename?: 'WeeklyEvent';
  id: Scalars['Float'];
  startTime: Scalars['Float'];
  endTime: Scalars['Float'];
  day: Scalars['Int'];
  room: Room;
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
  createQueue: Queue;
  updateQueue: Queue;
  removeQueue: Scalars['String'];
  undoRemove: Question;
  createCourse: Course;
  deleteCourse: Scalars['String'];
  createRoom: Room;
  updateRoom: Room;
  deleteRoom: Scalars['String'];
  archiveRoom: Room;
  askQuestion: Question;
  updateQuestionStatus: Question;
  addStaff: Array<CourseStaff>;
  removeStaff: Scalars['String'];
  addStudentEnrolment: Array<CourseUserMeta>;
};


export type MutationCreateQueueArgs = {
  queueInput: QueueInput;
  roomId: Scalars['String'];
};


export type MutationUpdateQueueArgs = {
  queueInput: QueueInput;
  queueId: Scalars['String'];
};


export type MutationRemoveQueueArgs = {
  queueId: Scalars['String'];
};


export type MutationUndoRemoveArgs = {
  queueId: Scalars['String'];
};


export type MutationCreateCourseArgs = {
  courseInput: CourseInput;
};


export type MutationDeleteCourseArgs = {
  courseId: Scalars['String'];
};


export type MutationCreateRoomArgs = {
  roomInput: RoomInput;
  courseId: Scalars['String'];
};


export type MutationUpdateRoomArgs = {
  roomInput: RoomInput;
  roomId: Scalars['String'];
};


export type MutationDeleteRoomArgs = {
  roomId: Scalars['String'];
};


export type MutationArchiveRoomArgs = {
  archive: Scalars['Boolean'];
  roomId: Scalars['String'];
};


export type MutationAskQuestionArgs = {
  queueId: Scalars['String'];
};


export type MutationUpdateQuestionStatusArgs = {
  message?: Maybe<Scalars['String']>;
  questionId: Scalars['String'];
  questionStatus: QuestionStatus;
};


export type MutationAddStaffArgs = {
  role: StaffRole;
  usernames: Array<Scalars['String']>;
  courseId: Scalars['String'];
};


export type MutationRemoveStaffArgs = {
  courseStaffId: Scalars['String'];
};


export type MutationAddStudentEnrolmentArgs = {
  userEnrolledSessions: Array<UserEnrolledSessionInput>;
  courseId: Scalars['String'];
};

export type QueueInput = {
  name: Scalars['String'];
  shortDescription: Scalars['String'];
  examples: Array<Scalars['String']>;
  theme: QueueTheme;
  sortedBy: QueueSortType;
  actions: Array<QueueAction>;
  clearAfterMidnight: Scalars['Boolean'];
  showEnrolledSession: Scalars['Boolean'];
};

export type CourseInput = {
  code: Scalars['String'];
  title: Scalars['String'];
  alias?: Maybe<Scalars['String']>;
};

export type RoomInput = {
  name: Scalars['String'];
  capacity: Scalars['Int'];
  enforceCapacity: Scalars['Boolean'];
  activeTimes: Array<EventInput>;
};

export type EventInput = {
  startTime: Scalars['Float'];
  endTime: Scalars['Float'];
  day: Scalars['Int'];
};

export type UserEnrolledSessionInput = {
  username: Scalars['String'];
  session: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  questionChanges: Question;
};


export type SubscriptionQuestionChangesArgs = {
  roomId: Scalars['String'];
};

export type GetCoursesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCoursesQuery = (
  { __typename?: 'Query' }
  & { getCourses: Array<(
    { __typename?: 'Course' }
    & Pick<Course, 'code' | 'id' | 'title' | 'alias'>
  )> }
);

export type AddCourseMutationVariables = Exact<{
  courseInput: CourseInput;
}>;


export type AddCourseMutation = (
  { __typename?: 'Mutation' }
  & { createCourse: (
    { __typename?: 'Course' }
    & Pick<Course, 'code' | 'id' | 'title' | 'alias'>
  ) }
);

export type DeleteCourseMutationVariables = Exact<{
  courseId: Scalars['String'];
}>;


export type DeleteCourseMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteCourse'>
);

export type AddCourseStaffMutationVariables = Exact<{
  courseId: Scalars['String'];
  usernames: Array<Scalars['String']> | Scalars['String'];
  role: StaffRole;
}>;


export type AddCourseStaffMutation = (
  { __typename?: 'Mutation' }
  & { addStaff: Array<(
    { __typename?: 'CourseStaff' }
    & Pick<CourseStaff, 'id' | 'role'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'username' | 'name'>
    ) }
  )> }
);

export type RemoveCourseStaffMutationVariables = Exact<{
  courseStaffId: Scalars['String'];
}>;


export type RemoveCourseStaffMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'removeStaff'>
);

export type GetCourseStaffQueryVariables = Exact<{
  courseId: Scalars['String'];
}>;


export type GetCourseStaffQuery = (
  { __typename?: 'Query' }
  & { getCourseStaff: Array<(
    { __typename?: 'CourseStaff' }
    & Pick<CourseStaff, 'id' | 'role'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'username' | 'name'>
    ) }
  )> }
);

export type AddStudentEnrolmentMutationVariables = Exact<{
  courseId: Scalars['String'];
  userEnrolledSessions: Array<UserEnrolledSessionInput> | UserEnrolledSessionInput;
}>;


export type AddStudentEnrolmentMutation = (
  { __typename?: 'Mutation' }
  & { addStudentEnrolment: Array<(
    { __typename?: 'CourseUserMeta' }
    & Pick<CourseUserMeta, 'enrolledSession'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'username'>
    ) }
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'name' | 'isAdmin'>
    & { getCourseStaff: Array<(
      { __typename?: 'CourseStaff' }
      & Pick<CourseStaff, 'role'>
      & { course: (
        { __typename?: 'Course' }
        & Pick<Course, 'id' | 'code' | 'title'>
        & { rooms: Array<(
          { __typename?: 'Room' }
          & Pick<Room, 'id' | 'name' | 'capacity' | 'enforceCapacity' | 'archived'>
          & { activeTimes: Array<(
            { __typename?: 'WeeklyEvent' }
            & Pick<WeeklyEvent, 'startTime' | 'endTime' | 'day'>
          )> }
        )> }
      ) }
    )> }
  ) }
);

export type QuestionChangeSubscriptionVariables = Exact<{
  roomId: Scalars['String'];
}>;


export type QuestionChangeSubscription = (
  { __typename?: 'Subscription' }
  & { questionChanges: (
    { __typename?: 'Question' }
    & Pick<Question, 'id' | 'status' | 'createdTime' | 'questionsAsked' | 'enrolledIn' | 'claimMessage'>
    & { op: (
      { __typename?: 'User' }
      & Pick<User, 'email' | 'name' | 'username'>
    ), claimer?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'username' | 'name'>
    )>, queue: (
      { __typename?: 'Queue' }
      & Pick<Queue, 'id'>
    ) }
  ) }
);

export type UndoRemoveMutationVariables = Exact<{
  queueId: Scalars['String'];
}>;


export type UndoRemoveMutation = (
  { __typename?: 'Mutation' }
  & { undoRemove: (
    { __typename?: 'Question' }
    & Pick<Question, 'id' | 'status' | 'createdTime' | 'questionsAsked' | 'enrolledIn' | 'claimMessage'>
    & { op: (
      { __typename?: 'User' }
      & Pick<User, 'email' | 'name' | 'username'>
    ), claimer?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'username' | 'name'>
    )>, queue: (
      { __typename?: 'Queue' }
      & Pick<Queue, 'id'>
    ) }
  ) }
);

export type AskQuestionMutationVariables = Exact<{
  queueId: Scalars['String'];
}>;


export type AskQuestionMutation = (
  { __typename?: 'Mutation' }
  & { askQuestion: (
    { __typename?: 'Question' }
    & Pick<Question, 'id' | 'status' | 'createdTime' | 'questionsAsked' | 'enrolledIn'>
    & { op: (
      { __typename?: 'User' }
      & Pick<User, 'email' | 'name' | 'username'>
    ), claimer?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'username' | 'name'>
    )>, queue: (
      { __typename?: 'Queue' }
      & Pick<Queue, 'id'>
    ) }
  ) }
);

export type UpdateQuestionStatusMutationVariables = Exact<{
  questionStatus: QuestionStatus;
  questionId: Scalars['String'];
  message?: Maybe<Scalars['String']>;
}>;


export type UpdateQuestionStatusMutation = (
  { __typename?: 'Mutation' }
  & { updateQuestionStatus: (
    { __typename?: 'Question' }
    & Pick<Question, 'id' | 'status' | 'createdTime' | 'questionsAsked' | 'enrolledIn'>
    & { op: (
      { __typename?: 'User' }
      & Pick<User, 'name' | 'email' | 'username'>
    ), claimer?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'username' | 'name'>
    )>, queue: (
      { __typename?: 'Queue' }
      & Pick<Queue, 'id'>
    ) }
  ) }
);

export type UpdateQueueMutationVariables = Exact<{
  queueId: Scalars['String'];
  queueInput: QueueInput;
}>;


export type UpdateQueueMutation = (
  { __typename?: 'Mutation' }
  & { updateQueue: (
    { __typename?: 'Queue' }
    & Pick<Queue, 'id' | 'name' | 'shortDescription' | 'examples' | 'actions' | 'theme' | 'sortedBy' | 'clearAfterMidnight' | 'showEnrolledSession' | 'createdAt'>
  ) }
);

export type CreateQueueMutationVariables = Exact<{
  roomId: Scalars['String'];
  queueInput: QueueInput;
}>;


export type CreateQueueMutation = (
  { __typename?: 'Mutation' }
  & { createQueue: (
    { __typename?: 'Queue' }
    & Pick<Queue, 'id' | 'name' | 'shortDescription' | 'examples' | 'actions' | 'theme' | 'sortedBy' | 'clearAfterMidnight' | 'showEnrolledSession' | 'createdAt'>
  ) }
);

export type RemoveQueueMutationVariables = Exact<{
  queueId: Scalars['String'];
}>;


export type RemoveQueueMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'removeQueue'>
);

export type GetActiveRoomsQueryVariables = Exact<{
  courseCode: Scalars['String'];
}>;


export type GetActiveRoomsQuery = (
  { __typename?: 'Query' }
  & { getActiveRooms: Array<(
    { __typename?: 'Room' }
    & Pick<Room, 'id' | 'name' | 'isActive' | 'archived'>
  )> }
);

export type GetRoomByIdQueryVariables = Exact<{
  roomId: Scalars['String'];
}>;


export type GetRoomByIdQuery = (
  { __typename?: 'Query' }
  & { getRoomById: (
    { __typename?: 'Room' }
    & Pick<Room, 'id' | 'name'>
    & { queues: Array<(
      { __typename?: 'Queue' }
      & Pick<Queue, 'id' | 'name' | 'shortDescription' | 'examples' | 'actions' | 'theme' | 'sortedBy' | 'clearAfterMidnight' | 'showEnrolledSession' | 'createdAt'>
      & { activeQuestions: Array<(
        { __typename?: 'Question' }
        & Pick<Question, 'id' | 'status' | 'createdTime' | 'questionsAsked' | 'enrolledIn'>
        & { op: (
          { __typename?: 'User' }
          & Pick<User, 'name' | 'email' | 'username'>
        ), claimer?: Maybe<(
          { __typename?: 'User' }
          & Pick<User, 'username' | 'name'>
        )> }
      )> }
    )> }
  ) }
);

export type UpdateRoomMutationVariables = Exact<{
  roomId: Scalars['String'];
  roomInput: RoomInput;
}>;


export type UpdateRoomMutation = (
  { __typename?: 'Mutation' }
  & { updateRoom: (
    { __typename?: 'Room' }
    & Pick<Room, 'id' | 'name' | 'capacity' | 'enforceCapacity' | 'archived'>
    & { activeTimes: Array<(
      { __typename?: 'WeeklyEvent' }
      & Pick<WeeklyEvent, 'startTime' | 'endTime' | 'day'>
    )> }
  ) }
);

export type AddRoomMutationVariables = Exact<{
  courseId: Scalars['String'];
  roomInput: RoomInput;
}>;


export type AddRoomMutation = (
  { __typename?: 'Mutation' }
  & { createRoom: (
    { __typename?: 'Room' }
    & Pick<Room, 'id' | 'name' | 'capacity' | 'enforceCapacity' | 'archived'>
    & { activeTimes: Array<(
      { __typename?: 'WeeklyEvent' }
      & Pick<WeeklyEvent, 'startTime' | 'endTime' | 'day'>
    )> }
  ) }
);

export type DeleteRoomMutationVariables = Exact<{
  roomId: Scalars['String'];
}>;


export type DeleteRoomMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteRoom'>
);

export type ArchiveRoomMutationVariables = Exact<{
  roomId: Scalars['String'];
  archive: Scalars['Boolean'];
}>;


export type ArchiveRoomMutation = (
  { __typename?: 'Mutation' }
  & { archiveRoom: (
    { __typename?: 'Room' }
    & Pick<Room, 'id' | 'name' | 'capacity' | 'enforceCapacity' | 'archived'>
    & { activeTimes: Array<(
      { __typename?: 'WeeklyEvent' }
      & Pick<WeeklyEvent, 'startTime' | 'endTime' | 'day'>
    )> }
  ) }
);


export const GetCoursesDocument = gql`
    query GetCourses {
  getCourses {
    code
    id
    title
    alias
  }
}
    `;

/**
 * __useGetCoursesQuery__
 *
 * To run a query within a React component, call `useGetCoursesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCoursesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCoursesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCoursesQuery(baseOptions?: Apollo.QueryHookOptions<GetCoursesQuery, GetCoursesQueryVariables>) {
        return Apollo.useQuery<GetCoursesQuery, GetCoursesQueryVariables>(GetCoursesDocument, baseOptions);
      }
export function useGetCoursesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCoursesQuery, GetCoursesQueryVariables>) {
          return Apollo.useLazyQuery<GetCoursesQuery, GetCoursesQueryVariables>(GetCoursesDocument, baseOptions);
        }
export type GetCoursesQueryHookResult = ReturnType<typeof useGetCoursesQuery>;
export type GetCoursesLazyQueryHookResult = ReturnType<typeof useGetCoursesLazyQuery>;
export type GetCoursesQueryResult = Apollo.QueryResult<GetCoursesQuery, GetCoursesQueryVariables>;
export const AddCourseDocument = gql`
    mutation AddCourse($courseInput: CourseInput!) {
  createCourse(courseInput: $courseInput) {
    code
    id
    title
    alias
  }
}
    `;
export type AddCourseMutationFn = Apollo.MutationFunction<AddCourseMutation, AddCourseMutationVariables>;

/**
 * __useAddCourseMutation__
 *
 * To run a mutation, you first call `useAddCourseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCourseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCourseMutation, { data, loading, error }] = useAddCourseMutation({
 *   variables: {
 *      courseInput: // value for 'courseInput'
 *   },
 * });
 */
export function useAddCourseMutation(baseOptions?: Apollo.MutationHookOptions<AddCourseMutation, AddCourseMutationVariables>) {
        return Apollo.useMutation<AddCourseMutation, AddCourseMutationVariables>(AddCourseDocument, baseOptions);
      }
export type AddCourseMutationHookResult = ReturnType<typeof useAddCourseMutation>;
export type AddCourseMutationResult = Apollo.MutationResult<AddCourseMutation>;
export type AddCourseMutationOptions = Apollo.BaseMutationOptions<AddCourseMutation, AddCourseMutationVariables>;
export const DeleteCourseDocument = gql`
    mutation DeleteCourse($courseId: String!) {
  deleteCourse(courseId: $courseId)
}
    `;
export type DeleteCourseMutationFn = Apollo.MutationFunction<DeleteCourseMutation, DeleteCourseMutationVariables>;

/**
 * __useDeleteCourseMutation__
 *
 * To run a mutation, you first call `useDeleteCourseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCourseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCourseMutation, { data, loading, error }] = useDeleteCourseMutation({
 *   variables: {
 *      courseId: // value for 'courseId'
 *   },
 * });
 */
export function useDeleteCourseMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCourseMutation, DeleteCourseMutationVariables>) {
        return Apollo.useMutation<DeleteCourseMutation, DeleteCourseMutationVariables>(DeleteCourseDocument, baseOptions);
      }
export type DeleteCourseMutationHookResult = ReturnType<typeof useDeleteCourseMutation>;
export type DeleteCourseMutationResult = Apollo.MutationResult<DeleteCourseMutation>;
export type DeleteCourseMutationOptions = Apollo.BaseMutationOptions<DeleteCourseMutation, DeleteCourseMutationVariables>;
export const AddCourseStaffDocument = gql`
    mutation AddCourseStaff($courseId: String!, $usernames: [String!]!, $role: StaffRole!) {
  addStaff(courseId: $courseId, usernames: $usernames, role: $role) {
    id
    user {
      username
      name
    }
    role
  }
}
    `;
export type AddCourseStaffMutationFn = Apollo.MutationFunction<AddCourseStaffMutation, AddCourseStaffMutationVariables>;

/**
 * __useAddCourseStaffMutation__
 *
 * To run a mutation, you first call `useAddCourseStaffMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCourseStaffMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCourseStaffMutation, { data, loading, error }] = useAddCourseStaffMutation({
 *   variables: {
 *      courseId: // value for 'courseId'
 *      usernames: // value for 'usernames'
 *      role: // value for 'role'
 *   },
 * });
 */
export function useAddCourseStaffMutation(baseOptions?: Apollo.MutationHookOptions<AddCourseStaffMutation, AddCourseStaffMutationVariables>) {
        return Apollo.useMutation<AddCourseStaffMutation, AddCourseStaffMutationVariables>(AddCourseStaffDocument, baseOptions);
      }
export type AddCourseStaffMutationHookResult = ReturnType<typeof useAddCourseStaffMutation>;
export type AddCourseStaffMutationResult = Apollo.MutationResult<AddCourseStaffMutation>;
export type AddCourseStaffMutationOptions = Apollo.BaseMutationOptions<AddCourseStaffMutation, AddCourseStaffMutationVariables>;
export const RemoveCourseStaffDocument = gql`
    mutation RemoveCourseStaff($courseStaffId: String!) {
  removeStaff(courseStaffId: $courseStaffId)
}
    `;
export type RemoveCourseStaffMutationFn = Apollo.MutationFunction<RemoveCourseStaffMutation, RemoveCourseStaffMutationVariables>;

/**
 * __useRemoveCourseStaffMutation__
 *
 * To run a mutation, you first call `useRemoveCourseStaffMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveCourseStaffMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeCourseStaffMutation, { data, loading, error }] = useRemoveCourseStaffMutation({
 *   variables: {
 *      courseStaffId: // value for 'courseStaffId'
 *   },
 * });
 */
export function useRemoveCourseStaffMutation(baseOptions?: Apollo.MutationHookOptions<RemoveCourseStaffMutation, RemoveCourseStaffMutationVariables>) {
        return Apollo.useMutation<RemoveCourseStaffMutation, RemoveCourseStaffMutationVariables>(RemoveCourseStaffDocument, baseOptions);
      }
export type RemoveCourseStaffMutationHookResult = ReturnType<typeof useRemoveCourseStaffMutation>;
export type RemoveCourseStaffMutationResult = Apollo.MutationResult<RemoveCourseStaffMutation>;
export type RemoveCourseStaffMutationOptions = Apollo.BaseMutationOptions<RemoveCourseStaffMutation, RemoveCourseStaffMutationVariables>;
export const GetCourseStaffDocument = gql`
    query GetCourseStaff($courseId: String!) {
  getCourseStaff(courseId: $courseId) {
    id
    user {
      username
      name
    }
    role
  }
}
    `;

/**
 * __useGetCourseStaffQuery__
 *
 * To run a query within a React component, call `useGetCourseStaffQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCourseStaffQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCourseStaffQuery({
 *   variables: {
 *      courseId: // value for 'courseId'
 *   },
 * });
 */
export function useGetCourseStaffQuery(baseOptions: Apollo.QueryHookOptions<GetCourseStaffQuery, GetCourseStaffQueryVariables>) {
        return Apollo.useQuery<GetCourseStaffQuery, GetCourseStaffQueryVariables>(GetCourseStaffDocument, baseOptions);
      }
export function useGetCourseStaffLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCourseStaffQuery, GetCourseStaffQueryVariables>) {
          return Apollo.useLazyQuery<GetCourseStaffQuery, GetCourseStaffQueryVariables>(GetCourseStaffDocument, baseOptions);
        }
export type GetCourseStaffQueryHookResult = ReturnType<typeof useGetCourseStaffQuery>;
export type GetCourseStaffLazyQueryHookResult = ReturnType<typeof useGetCourseStaffLazyQuery>;
export type GetCourseStaffQueryResult = Apollo.QueryResult<GetCourseStaffQuery, GetCourseStaffQueryVariables>;
export const AddStudentEnrolmentDocument = gql`
    mutation AddStudentEnrolment($courseId: String!, $userEnrolledSessions: [UserEnrolledSessionInput!]!) {
  addStudentEnrolment(
    courseId: $courseId
    userEnrolledSessions: $userEnrolledSessions
  ) {
    user {
      username
    }
    enrolledSession
  }
}
    `;
export type AddStudentEnrolmentMutationFn = Apollo.MutationFunction<AddStudentEnrolmentMutation, AddStudentEnrolmentMutationVariables>;

/**
 * __useAddStudentEnrolmentMutation__
 *
 * To run a mutation, you first call `useAddStudentEnrolmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddStudentEnrolmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addStudentEnrolmentMutation, { data, loading, error }] = useAddStudentEnrolmentMutation({
 *   variables: {
 *      courseId: // value for 'courseId'
 *      userEnrolledSessions: // value for 'userEnrolledSessions'
 *   },
 * });
 */
export function useAddStudentEnrolmentMutation(baseOptions?: Apollo.MutationHookOptions<AddStudentEnrolmentMutation, AddStudentEnrolmentMutationVariables>) {
        return Apollo.useMutation<AddStudentEnrolmentMutation, AddStudentEnrolmentMutationVariables>(AddStudentEnrolmentDocument, baseOptions);
      }
export type AddStudentEnrolmentMutationHookResult = ReturnType<typeof useAddStudentEnrolmentMutation>;
export type AddStudentEnrolmentMutationResult = Apollo.MutationResult<AddStudentEnrolmentMutation>;
export type AddStudentEnrolmentMutationOptions = Apollo.BaseMutationOptions<AddStudentEnrolmentMutation, AddStudentEnrolmentMutationVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    username
    name
    isAdmin
    getCourseStaff {
      course {
        id
        code
        title
        rooms {
          id
          name
          capacity
          enforceCapacity
          archived
          activeTimes {
            startTime
            endTime
            day
          }
        }
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
export const QuestionChangeDocument = gql`
    subscription QuestionChange($roomId: String!) {
  questionChanges(roomId: $roomId) {
    id
    status
    op {
      email
      name
      username
    }
    createdTime
    claimer {
      username
      name
    }
    questionsAsked
    queue {
      id
    }
    enrolledIn
    claimMessage
  }
}
    `;

/**
 * __useQuestionChangeSubscription__
 *
 * To run a query within a React component, call `useQuestionChangeSubscription` and pass it any options that fit your needs.
 * When your component renders, `useQuestionChangeSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQuestionChangeSubscription({
 *   variables: {
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useQuestionChangeSubscription(baseOptions: Apollo.SubscriptionHookOptions<QuestionChangeSubscription, QuestionChangeSubscriptionVariables>) {
        return Apollo.useSubscription<QuestionChangeSubscription, QuestionChangeSubscriptionVariables>(QuestionChangeDocument, baseOptions);
      }
export type QuestionChangeSubscriptionHookResult = ReturnType<typeof useQuestionChangeSubscription>;
export type QuestionChangeSubscriptionResult = Apollo.SubscriptionResult<QuestionChangeSubscription>;
export const UndoRemoveDocument = gql`
    mutation UndoRemove($queueId: String!) {
  undoRemove(queueId: $queueId) {
    id
    status
    op {
      email
      name
      username
    }
    createdTime
    claimer {
      username
      name
    }
    questionsAsked
    queue {
      id
    }
    enrolledIn
    claimMessage
  }
}
    `;
export type UndoRemoveMutationFn = Apollo.MutationFunction<UndoRemoveMutation, UndoRemoveMutationVariables>;

/**
 * __useUndoRemoveMutation__
 *
 * To run a mutation, you first call `useUndoRemoveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUndoRemoveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [undoRemoveMutation, { data, loading, error }] = useUndoRemoveMutation({
 *   variables: {
 *      queueId: // value for 'queueId'
 *   },
 * });
 */
export function useUndoRemoveMutation(baseOptions?: Apollo.MutationHookOptions<UndoRemoveMutation, UndoRemoveMutationVariables>) {
        return Apollo.useMutation<UndoRemoveMutation, UndoRemoveMutationVariables>(UndoRemoveDocument, baseOptions);
      }
export type UndoRemoveMutationHookResult = ReturnType<typeof useUndoRemoveMutation>;
export type UndoRemoveMutationResult = Apollo.MutationResult<UndoRemoveMutation>;
export type UndoRemoveMutationOptions = Apollo.BaseMutationOptions<UndoRemoveMutation, UndoRemoveMutationVariables>;
export const AskQuestionDocument = gql`
    mutation AskQuestion($queueId: String!) {
  askQuestion(queueId: $queueId) {
    id
    status
    op {
      email
      name
      username
    }
    createdTime
    claimer {
      username
      name
    }
    questionsAsked
    queue {
      id
    }
    enrolledIn
  }
}
    `;
export type AskQuestionMutationFn = Apollo.MutationFunction<AskQuestionMutation, AskQuestionMutationVariables>;

/**
 * __useAskQuestionMutation__
 *
 * To run a mutation, you first call `useAskQuestionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAskQuestionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [askQuestionMutation, { data, loading, error }] = useAskQuestionMutation({
 *   variables: {
 *      queueId: // value for 'queueId'
 *   },
 * });
 */
export function useAskQuestionMutation(baseOptions?: Apollo.MutationHookOptions<AskQuestionMutation, AskQuestionMutationVariables>) {
        return Apollo.useMutation<AskQuestionMutation, AskQuestionMutationVariables>(AskQuestionDocument, baseOptions);
      }
export type AskQuestionMutationHookResult = ReturnType<typeof useAskQuestionMutation>;
export type AskQuestionMutationResult = Apollo.MutationResult<AskQuestionMutation>;
export type AskQuestionMutationOptions = Apollo.BaseMutationOptions<AskQuestionMutation, AskQuestionMutationVariables>;
export const UpdateQuestionStatusDocument = gql`
    mutation UpdateQuestionStatus($questionStatus: QuestionStatus!, $questionId: String!, $message: String) {
  updateQuestionStatus(
    questionStatus: $questionStatus
    questionId: $questionId
    message: $message
  ) {
    id
    status
    op {
      name
      email
      username
    }
    createdTime
    claimer {
      username
      name
    }
    questionsAsked
    queue {
      id
    }
    enrolledIn
  }
}
    `;
export type UpdateQuestionStatusMutationFn = Apollo.MutationFunction<UpdateQuestionStatusMutation, UpdateQuestionStatusMutationVariables>;

/**
 * __useUpdateQuestionStatusMutation__
 *
 * To run a mutation, you first call `useUpdateQuestionStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateQuestionStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateQuestionStatusMutation, { data, loading, error }] = useUpdateQuestionStatusMutation({
 *   variables: {
 *      questionStatus: // value for 'questionStatus'
 *      questionId: // value for 'questionId'
 *      message: // value for 'message'
 *   },
 * });
 */
export function useUpdateQuestionStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpdateQuestionStatusMutation, UpdateQuestionStatusMutationVariables>) {
        return Apollo.useMutation<UpdateQuestionStatusMutation, UpdateQuestionStatusMutationVariables>(UpdateQuestionStatusDocument, baseOptions);
      }
export type UpdateQuestionStatusMutationHookResult = ReturnType<typeof useUpdateQuestionStatusMutation>;
export type UpdateQuestionStatusMutationResult = Apollo.MutationResult<UpdateQuestionStatusMutation>;
export type UpdateQuestionStatusMutationOptions = Apollo.BaseMutationOptions<UpdateQuestionStatusMutation, UpdateQuestionStatusMutationVariables>;
export const UpdateQueueDocument = gql`
    mutation UpdateQueue($queueId: String!, $queueInput: QueueInput!) {
  updateQueue(queueId: $queueId, queueInput: $queueInput) {
    id
    name
    shortDescription
    examples
    actions
    theme
    sortedBy
    clearAfterMidnight
    showEnrolledSession
    createdAt
  }
}
    `;
export type UpdateQueueMutationFn = Apollo.MutationFunction<UpdateQueueMutation, UpdateQueueMutationVariables>;

/**
 * __useUpdateQueueMutation__
 *
 * To run a mutation, you first call `useUpdateQueueMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateQueueMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateQueueMutation, { data, loading, error }] = useUpdateQueueMutation({
 *   variables: {
 *      queueId: // value for 'queueId'
 *      queueInput: // value for 'queueInput'
 *   },
 * });
 */
export function useUpdateQueueMutation(baseOptions?: Apollo.MutationHookOptions<UpdateQueueMutation, UpdateQueueMutationVariables>) {
        return Apollo.useMutation<UpdateQueueMutation, UpdateQueueMutationVariables>(UpdateQueueDocument, baseOptions);
      }
export type UpdateQueueMutationHookResult = ReturnType<typeof useUpdateQueueMutation>;
export type UpdateQueueMutationResult = Apollo.MutationResult<UpdateQueueMutation>;
export type UpdateQueueMutationOptions = Apollo.BaseMutationOptions<UpdateQueueMutation, UpdateQueueMutationVariables>;
export const CreateQueueDocument = gql`
    mutation CreateQueue($roomId: String!, $queueInput: QueueInput!) {
  createQueue(roomId: $roomId, queueInput: $queueInput) {
    id
    name
    shortDescription
    examples
    actions
    theme
    sortedBy
    clearAfterMidnight
    showEnrolledSession
    createdAt
  }
}
    `;
export type CreateQueueMutationFn = Apollo.MutationFunction<CreateQueueMutation, CreateQueueMutationVariables>;

/**
 * __useCreateQueueMutation__
 *
 * To run a mutation, you first call `useCreateQueueMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateQueueMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createQueueMutation, { data, loading, error }] = useCreateQueueMutation({
 *   variables: {
 *      roomId: // value for 'roomId'
 *      queueInput: // value for 'queueInput'
 *   },
 * });
 */
export function useCreateQueueMutation(baseOptions?: Apollo.MutationHookOptions<CreateQueueMutation, CreateQueueMutationVariables>) {
        return Apollo.useMutation<CreateQueueMutation, CreateQueueMutationVariables>(CreateQueueDocument, baseOptions);
      }
export type CreateQueueMutationHookResult = ReturnType<typeof useCreateQueueMutation>;
export type CreateQueueMutationResult = Apollo.MutationResult<CreateQueueMutation>;
export type CreateQueueMutationOptions = Apollo.BaseMutationOptions<CreateQueueMutation, CreateQueueMutationVariables>;
export const RemoveQueueDocument = gql`
    mutation RemoveQueue($queueId: String!) {
  removeQueue(queueId: $queueId)
}
    `;
export type RemoveQueueMutationFn = Apollo.MutationFunction<RemoveQueueMutation, RemoveQueueMutationVariables>;

/**
 * __useRemoveQueueMutation__
 *
 * To run a mutation, you first call `useRemoveQueueMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveQueueMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeQueueMutation, { data, loading, error }] = useRemoveQueueMutation({
 *   variables: {
 *      queueId: // value for 'queueId'
 *   },
 * });
 */
export function useRemoveQueueMutation(baseOptions?: Apollo.MutationHookOptions<RemoveQueueMutation, RemoveQueueMutationVariables>) {
        return Apollo.useMutation<RemoveQueueMutation, RemoveQueueMutationVariables>(RemoveQueueDocument, baseOptions);
      }
export type RemoveQueueMutationHookResult = ReturnType<typeof useRemoveQueueMutation>;
export type RemoveQueueMutationResult = Apollo.MutationResult<RemoveQueueMutation>;
export type RemoveQueueMutationOptions = Apollo.BaseMutationOptions<RemoveQueueMutation, RemoveQueueMutationVariables>;
export const GetActiveRoomsDocument = gql`
    query GetActiveRooms($courseCode: String!) {
  getActiveRooms(courseCode: $courseCode) {
    id
    name
    isActive
    archived
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
export const GetRoomByIdDocument = gql`
    query GetRoomById($roomId: String!) {
  getRoomById(roomId: $roomId) {
    id
    name
    queues {
      id
      name
      shortDescription
      examples
      actions
      theme
      sortedBy
      clearAfterMidnight
      showEnrolledSession
      activeQuestions {
        id
        op {
          name
          email
          username
        }
        status
        createdTime
        claimer {
          username
          name
        }
        questionsAsked
        enrolledIn
      }
      createdAt
    }
  }
}
    `;

/**
 * __useGetRoomByIdQuery__
 *
 * To run a query within a React component, call `useGetRoomByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRoomByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRoomByIdQuery({
 *   variables: {
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useGetRoomByIdQuery(baseOptions: Apollo.QueryHookOptions<GetRoomByIdQuery, GetRoomByIdQueryVariables>) {
        return Apollo.useQuery<GetRoomByIdQuery, GetRoomByIdQueryVariables>(GetRoomByIdDocument, baseOptions);
      }
export function useGetRoomByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRoomByIdQuery, GetRoomByIdQueryVariables>) {
          return Apollo.useLazyQuery<GetRoomByIdQuery, GetRoomByIdQueryVariables>(GetRoomByIdDocument, baseOptions);
        }
export type GetRoomByIdQueryHookResult = ReturnType<typeof useGetRoomByIdQuery>;
export type GetRoomByIdLazyQueryHookResult = ReturnType<typeof useGetRoomByIdLazyQuery>;
export type GetRoomByIdQueryResult = Apollo.QueryResult<GetRoomByIdQuery, GetRoomByIdQueryVariables>;
export const UpdateRoomDocument = gql`
    mutation UpdateRoom($roomId: String!, $roomInput: RoomInput!) {
  updateRoom(roomId: $roomId, roomInput: $roomInput) {
    id
    name
    capacity
    enforceCapacity
    archived
    activeTimes {
      startTime
      endTime
      day
    }
  }
}
    `;
export type UpdateRoomMutationFn = Apollo.MutationFunction<UpdateRoomMutation, UpdateRoomMutationVariables>;

/**
 * __useUpdateRoomMutation__
 *
 * To run a mutation, you first call `useUpdateRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRoomMutation, { data, loading, error }] = useUpdateRoomMutation({
 *   variables: {
 *      roomId: // value for 'roomId'
 *      roomInput: // value for 'roomInput'
 *   },
 * });
 */
export function useUpdateRoomMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRoomMutation, UpdateRoomMutationVariables>) {
        return Apollo.useMutation<UpdateRoomMutation, UpdateRoomMutationVariables>(UpdateRoomDocument, baseOptions);
      }
export type UpdateRoomMutationHookResult = ReturnType<typeof useUpdateRoomMutation>;
export type UpdateRoomMutationResult = Apollo.MutationResult<UpdateRoomMutation>;
export type UpdateRoomMutationOptions = Apollo.BaseMutationOptions<UpdateRoomMutation, UpdateRoomMutationVariables>;
export const AddRoomDocument = gql`
    mutation AddRoom($courseId: String!, $roomInput: RoomInput!) {
  createRoom(courseId: $courseId, roomInput: $roomInput) {
    id
    name
    capacity
    enforceCapacity
    archived
    activeTimes {
      startTime
      endTime
      day
    }
  }
}
    `;
export type AddRoomMutationFn = Apollo.MutationFunction<AddRoomMutation, AddRoomMutationVariables>;

/**
 * __useAddRoomMutation__
 *
 * To run a mutation, you first call `useAddRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addRoomMutation, { data, loading, error }] = useAddRoomMutation({
 *   variables: {
 *      courseId: // value for 'courseId'
 *      roomInput: // value for 'roomInput'
 *   },
 * });
 */
export function useAddRoomMutation(baseOptions?: Apollo.MutationHookOptions<AddRoomMutation, AddRoomMutationVariables>) {
        return Apollo.useMutation<AddRoomMutation, AddRoomMutationVariables>(AddRoomDocument, baseOptions);
      }
export type AddRoomMutationHookResult = ReturnType<typeof useAddRoomMutation>;
export type AddRoomMutationResult = Apollo.MutationResult<AddRoomMutation>;
export type AddRoomMutationOptions = Apollo.BaseMutationOptions<AddRoomMutation, AddRoomMutationVariables>;
export const DeleteRoomDocument = gql`
    mutation DeleteRoom($roomId: String!) {
  deleteRoom(roomId: $roomId)
}
    `;
export type DeleteRoomMutationFn = Apollo.MutationFunction<DeleteRoomMutation, DeleteRoomMutationVariables>;

/**
 * __useDeleteRoomMutation__
 *
 * To run a mutation, you first call `useDeleteRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRoomMutation, { data, loading, error }] = useDeleteRoomMutation({
 *   variables: {
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useDeleteRoomMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRoomMutation, DeleteRoomMutationVariables>) {
        return Apollo.useMutation<DeleteRoomMutation, DeleteRoomMutationVariables>(DeleteRoomDocument, baseOptions);
      }
export type DeleteRoomMutationHookResult = ReturnType<typeof useDeleteRoomMutation>;
export type DeleteRoomMutationResult = Apollo.MutationResult<DeleteRoomMutation>;
export type DeleteRoomMutationOptions = Apollo.BaseMutationOptions<DeleteRoomMutation, DeleteRoomMutationVariables>;
export const ArchiveRoomDocument = gql`
    mutation ArchiveRoom($roomId: String!, $archive: Boolean!) {
  archiveRoom(archive: $archive, roomId: $roomId) {
    id
    name
    capacity
    enforceCapacity
    archived
    activeTimes {
      startTime
      endTime
      day
    }
  }
}
    `;
export type ArchiveRoomMutationFn = Apollo.MutationFunction<ArchiveRoomMutation, ArchiveRoomMutationVariables>;

/**
 * __useArchiveRoomMutation__
 *
 * To run a mutation, you first call `useArchiveRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveRoomMutation, { data, loading, error }] = useArchiveRoomMutation({
 *   variables: {
 *      roomId: // value for 'roomId'
 *      archive: // value for 'archive'
 *   },
 * });
 */
export function useArchiveRoomMutation(baseOptions?: Apollo.MutationHookOptions<ArchiveRoomMutation, ArchiveRoomMutationVariables>) {
        return Apollo.useMutation<ArchiveRoomMutation, ArchiveRoomMutationVariables>(ArchiveRoomDocument, baseOptions);
      }
export type ArchiveRoomMutationHookResult = ReturnType<typeof useArchiveRoomMutation>;
export type ArchiveRoomMutationResult = Apollo.MutationResult<ArchiveRoomMutation>;
export type ArchiveRoomMutationOptions = Apollo.BaseMutationOptions<ArchiveRoomMutation, ArchiveRoomMutationVariables>;