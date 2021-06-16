--
-- PostgreSQL database dump
--

-- Dumped from database version 13.1
-- Dumped by pg_dump version 13.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE IF EXISTS queue;
--
-- Name: queue; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE queue WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C';


ALTER DATABASE queue OWNER TO postgres;

\connect queue

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: course; Type: TABLE; Schema: public; Owner: queue
--

CREATE TABLE public.course (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    code character varying NOT NULL,
    title character varying NOT NULL,
    alias character varying
);


ALTER TABLE public.course OWNER TO postgres;

--
-- Name: course_staff; Type: TABLE; Schema: public; Owner: queue
--

CREATE TABLE public.course_staff (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    role character varying NOT NULL,
    "courseId" uuid NOT NULL,
    "userId" uuid NOT NULL,
    CONSTRAINT "CHK_0ce1e4e9dd7918c677ec6da607" CHECK ((((role)::text = 'Staff'::text) OR ((role)::text = 'Coordinator'::text)))
);


ALTER TABLE public.course_staff OWNER TO postgres;

--
-- Name: course_user_meta; Type: TABLE; Schema: public; Owner: queue
--

CREATE TABLE public.course_user_meta (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "questionsAsked" integer NOT NULL,
    "userId" uuid NOT NULL,
    "courseId" uuid NOT NULL,
    "enrolledSession" character varying
);


ALTER TABLE public.course_user_meta OWNER TO postgres;

--
-- Name: migrations; Type: TABLE; Schema: public; Owner: queue
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: queue
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.migrations_id_seq OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: queue
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: question; Type: TABLE; Schema: public; Owner: queue
--

CREATE TABLE public.question (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    status character varying NOT NULL,
    "createdTime" timestamp without time zone DEFAULT now() NOT NULL,
    "claimMessage" character varying,
    "opId" uuid NOT NULL,
    "queueId" uuid NOT NULL,
    "claimerId" uuid,
    "claimTime" timestamp with time zone,
    "closedTime" timestamp with time zone,
    CONSTRAINT "CHK_8980ea151496a839aa3fb0048b" CHECK ((((status)::text = 'Open'::text) OR ((status)::text = 'Claimed'::text) OR ((status)::text = 'Closed'::text) OR ((status)::text = 'Accepted'::text) OR ((status)::text = 'Not needed'::text)))
);


ALTER TABLE public.question OWNER TO postgres;

--
-- Name: queue; Type: TABLE; Schema: public; Owner: queue
--

CREATE TABLE public.queue (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    examples character varying[] DEFAULT ARRAY[]::character varying[] NOT NULL,
    theme character varying NOT NULL,
    "sortedBy" character varying NOT NULL,
    actions character varying[] DEFAULT ARRAY[]::character varying[] NOT NULL,
    "roomId" uuid NOT NULL,
    "clearAfterMidnight" boolean DEFAULT false NOT NULL,
    name character varying NOT NULL,
    "shortDescription" character varying NOT NULL,
    "showEnrolledSession" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT "CHK_c73a4fad2b1b51f24806d41e71" CHECK ((((theme)::text = 'Gray'::text) OR ((theme)::text = 'Red'::text) OR ((theme)::text = 'Orange'::text) OR ((theme)::text = 'Yellow'::text) OR ((theme)::text = 'Green'::text) OR ((theme)::text = 'Teal'::text) OR ((theme)::text = 'Blue'::text) OR ((theme)::text = 'Cyan'::text) OR ((theme)::text = 'Purple'::text) OR ((theme)::text = 'Pink'::text))),
    CONSTRAINT "CHK_da845b8698957fbde402fa2757" CHECK (((("sortedBy")::text = 'Time'::text) OR (("sortedBy")::text = 'Questions'::text) OR (("sortedBy")::text = 'Question and time'::text)))
);


ALTER TABLE public.queue OWNER TO postgres;

--
-- Name: room; Type: TABLE; Schema: public; Owner: queue
--

CREATE TABLE public.room (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    capacity integer NOT NULL,
    "enforceCapacity" boolean NOT NULL,
    "manuallyDisabled" boolean NOT NULL,
    "courseId" uuid NOT NULL
);


ALTER TABLE public.room OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: queue
--

CREATE TABLE public."user" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    "isOnline" boolean DEFAULT false NOT NULL,
    "isAdmin" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: weekly_event; Type: TABLE; Schema: public; Owner: queue
--

CREATE TABLE public.weekly_event (
    "startTime" integer NOT NULL,
    "endTime" integer NOT NULL,
    "roomId" uuid,
    day integer NOT NULL,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    CONSTRAINT "CHK_fa4e975db77ca08618fd5c4adf" CHECK (((day = 1) OR (day = 2) OR (day = 3) OR (day = 4) OR (day = 5) OR (day = 6) OR (day = 7)))
);


ALTER TABLE public.weekly_event OWNER TO postgres;

--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: queue
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Data for Name: course; Type: TABLE DATA; Schema: public; Owner: queue
--

INSERT INTO public.course VALUES ('493b50bf-e7b5-42d7-b275-77ed87b5614c', 'CSSE1001', 'Introduction to Software Engineering', 'CSSE7030');
INSERT INTO public.course VALUES ('2d3959a2-2a10-4a00-a120-721fd4676698', 'CSSE2002', 'Programming in the Large', 'CSSE7023');


--
-- Data for Name: course_staff; Type: TABLE DATA; Schema: public; Owner: queue
--

INSERT INTO public.course_staff VALUES ('a9322a19-0203-4ea7-b8c9-f79a998451e2', 'Coordinator', '493b50bf-e7b5-42d7-b275-77ed87b5614c', '6808c9f7-443b-4d79-8906-2ee0d1401daa');
INSERT INTO public.course_staff VALUES ('e7609f65-9800-4749-8d4e-1722cfab5e54', 'Coordinator', '2d3959a2-2a10-4a00-a120-721fd4676698', '46247d34-53f3-41ba-ab6c-aa77d4eb6eb7');


--
-- Data for Name: course_user_meta; Type: TABLE DATA; Schema: public; Owner: queue
--



--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: queue
--

INSERT INTO public.migrations VALUES (1, 1613780943953, 'Migration1613780943953');
INSERT INTO public.migrations VALUES (2, 1613786022471, 'Migration1613786022471');
INSERT INTO public.migrations VALUES (3, 1613788961532, 'Migration1613788961532');
INSERT INTO public.migrations VALUES (4, 1613792525030, 'Migration1613792525030');
INSERT INTO public.migrations VALUES (5, 1613802309050, 'Migration1613802309050');
INSERT INTO public.migrations VALUES (6, 1613804066435, 'Migration1613804066435');
INSERT INTO public.migrations VALUES (7, 1613804997778, 'Migration1613804997778');
INSERT INTO public.migrations VALUES (8, 1613805168887, 'Migration1613805168887');
INSERT INTO public.migrations VALUES (9, 1613806948364, 'Migration1613806948364');
INSERT INTO public.migrations VALUES (10, 1613832525442, 'Migration1613832525442');
INSERT INTO public.migrations VALUES (11, 1613834054177, 'Migration1613834054177');
INSERT INTO public.migrations VALUES (12, 1613834425762, 'Migration1613834425762');
INSERT INTO public.migrations VALUES (13, 1613835986095, 'Migration1613835986095');
INSERT INTO public.migrations VALUES (14, 1613838371888, 'Migration1613838371888');
INSERT INTO public.migrations VALUES (15, 1613839789906, 'Migration1613839789906');
INSERT INTO public.migrations VALUES (16, 1614004123122, 'Migration1614004123122');
INSERT INTO public.migrations VALUES (17, 1614021571211, 'Migration1614021571211');
INSERT INTO public.migrations VALUES (18, 1614099126929, 'Migration1614099126929');
INSERT INTO public.migrations VALUES (19, 1614211735352, 'Migration1614211735352');
INSERT INTO public.migrations VALUES (20, 1614221920809, 'Migration1614221920809');
INSERT INTO public.migrations VALUES (21, 1614256322210, 'Migration1614256322210');
INSERT INTO public.migrations VALUES (22, 1614296848429, 'Migration1614296848429');
INSERT INTO public.migrations VALUES (24, 1614427470598, 'Migration1614427470598');
INSERT INTO public.migrations VALUES (25, 1614496431258, 'Migration1614496431258');
INSERT INTO public.migrations VALUES (26, 1614592128974, 'Migration1614592128974');
INSERT INTO public.migrations VALUES (27, 1616620444923, 'Migration1616620444923');


--
-- Data for Name: question; Type: TABLE DATA; Schema: public; Owner: queue
--



--
-- Data for Name: queue; Type: TABLE DATA; Schema: public; Owner: queue
--

INSERT INTO public.queue VALUES ('50a2bbc0-83f7-4db9-9483-701d90e1c792', '{}', 'Red', 'Question and time', '{Accept,Remove,Email,"Mark not needed",Claim}', '439750e4-996e-41b5-9515-c4601774dce5', true, 'Quick', '< 2 mins with a tutor', true, '2021-06-16 15:03:50.031668');
INSERT INTO public.queue VALUES ('198b5096-6685-4561-a12d-0420f89105e8', '{}', 'Orange', 'Question and time', '{Accept,Remove,Claim,Email,"Mark not needed"}', '439750e4-996e-41b5-9515-c4601774dce5', true, 'Long', '> 2 mins with a tutor', false, '2021-06-16 15:04:06.745552');
INSERT INTO public.queue VALUES ('3080beab-d2a4-4758-a621-fc69aa456c27', '{}', 'Green', 'Question and time', '{Accept,Remove,Claim,Email,"Mark not needed"}', '0904cde0-0ec9-46c0-b674-b796c116c46a', true, 'Short', '< 2 mins with a tutor', false, '2021-06-16 15:04:33.489998');
INSERT INTO public.queue VALUES ('1222e3aa-5494-4abf-ba55-ec7855aede3c', '{}', 'Cyan', 'Question and time', '{Accept,Remove,Claim,Email,"Mark not needed"}', '0904cde0-0ec9-46c0-b674-b796c116c46a', true, 'Long', '> 2 mins with a tutor', false, '2021-06-16 15:04:46.592958');
INSERT INTO public.queue VALUES ('cbb6f663-f708-4ed1-9845-d1dbe7341a63', '{}', 'Purple', 'Question and time', '{Accept,Remove}', '9941444c-f092-4d88-a637-237714edc92b', true, 'Prac', 'Any assignment question', false, '2021-06-16 15:06:46.323837');


--
-- Data for Name: room; Type: TABLE DATA; Schema: public; Owner: queue
--

INSERT INTO public.room VALUES ('0904cde0-0ec9-46c0-b674-b796c116c46a', 'Online', 0, false, false, '493b50bf-e7b5-42d7-b275-77ed87b5614c');
INSERT INTO public.room VALUES ('439750e4-996e-41b5-9515-c4601774dce5', '50-S203', 0, false, false, '493b50bf-e7b5-42d7-b275-77ed87b5614c');
INSERT INTO public.room VALUES ('9941444c-f092-4d88-a637-237714edc92b', 'Prac help', 0, false, false, '2d3959a2-2a10-4a00-a120-721fd4676698');


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: queue
--

INSERT INTO public."user" VALUES ('6808c9f7-443b-4d79-8906-2ee0d1401daa', 'uqmnguy', 'Marvin Nguyen', 'marvin.nguyen@example.com', false, false);
INSERT INTO public."user" VALUES ('46247d34-53f3-41ba-ab6c-aa77d4eb6eb7', 'uqjcrai', 'Jerry Craig', 'jerry.craig@example.com', false, false);
INSERT INTO public."user" VALUES ('a3ecbec3-f265-4172-9776-7d8b850eaac4', 'uqjcrai1', 'Joe Craig', 'joe.craig@example.com', false, false);
INSERT INTO public."user" VALUES ('31331f78-35e8-47b5-a374-e69212ad6c77', 'uqdcarl', 'Don Carlson', 'don.carlson@example.com', false, false);
INSERT INTO public."user" VALUES ('5502876f-4417-4910-89a7-84dfb43d342a', 'uqspalm', 'Sue Palmer', 'sue.palmer@example.com', false, false);
INSERT INTO public."user" VALUES ('5933c133-3edf-4cc2-a1b7-3e40f4e64696', 'uqcvasq', 'Cathy Vasquez', 'cathy.vasquez@example.com', false, false);
INSERT INTO public."user" VALUES ('a9f28e54-41e0-4018-bc3b-ece6b6d8d944', 'uqvhort', 'Vera Horton', 'vera.horton@example.com', false, false);
INSERT INTO public."user" VALUES ('0d729740-52e7-4b33-a935-822c452bfa88', 'uqmstan', 'Michael Stanley', 'michael.stanley@example.com', false, false);
INSERT INTO public."user" VALUES ('48fc5f0d-c3cb-4932-bf69-b9bf9338320f', 'uqbkenn', 'Bernice Kennedy', 'bernice.kennedy@example.com', false, false);
INSERT INTO public."user" VALUES ('76afce7e-73e7-4e99-a0a0-b368813d5d7e', 'uqmhowe', 'Mark Howell', 'mark.howell@example.com', false, false);
INSERT INTO public."user" VALUES ('c4e84ac7-d1e9-41d5-9705-65dfd715ac08', 'uqdvarg', 'Danielle Vargas', 'danielle.vargas@example.com', false, false);
INSERT INTO public."user" VALUES ('966647e4-d0dc-4ee3-b393-3e9f6a7bcdc8', 'uqafiel', 'Alfredo Fields', 'alfredo.fields@example.com', false, false);
INSERT INTO public."user" VALUES ('4f5fcfca-1f53-49fb-975f-3ad31270866a', 'uqphaye', 'Paul Hayes', 'paul.hayes@example.com', false, false);
INSERT INTO public."user" VALUES ('dc6c34b8-21a0-4c01-8bd9-01b70fab5224', 'uqjbowm', 'Jo Bowman', 'jo.bowman@example.com', false, false);
INSERT INTO public."user" VALUES ('b3f5b7b5-8790-45f9-9da8-76950db5fad0', 'uqsdixo', 'Sophia Dixon', 'sophia.dixon@example.com', false, false);
INSERT INTO public."user" VALUES ('9ef81a60-0da4-482b-b26b-cf48af50cf0e', 'uqtolso', 'Terrance Olson', 'terrance.olson@example.com', false, false);
INSERT INTO public."user" VALUES ('a9563ec2-2c64-4c08-87d2-20f308ff3204', 'uqlrobi', 'Lawrence Robinson', 'lawrence.robinson@example.com', false, false);
INSERT INTO public."user" VALUES ('e59f5bf2-2ed0-4039-b526-292bb349b32d', 'uqswill', 'Sue Williams', 'sue.williams@example.com', false, false);
INSERT INTO public."user" VALUES ('b22b0bfc-9b5e-4bc4-a512-21b2d82fa736', 'uqmmyer', 'Marian Myers', 'marian.myers@example.com', false, false);
INSERT INTO public."user" VALUES ('2fd9859f-77b0-4b27-83a3-6fd5602d9632', 'uqaowen', 'Amelia Owens', 'amelia.owens@example.com', false, false);
INSERT INTO public."user" VALUES ('6e838f47-7ffd-4b41-9be3-55dc32dd363d', 'uqjkell', 'Jamie Kelly', 'jamie.kelly@example.com', false, false);
INSERT INTO public."user" VALUES ('f28ba17f-548f-4513-9ff7-8ef2909a63ed', 'uqnpete', 'Nathaniel Peterson', 'nathaniel.peterson@example.com', false, false);
INSERT INTO public."user" VALUES ('a24b8576-d4b4-4326-9570-1f3dfa21b66a', 'uqabeck', 'Alberto Beck', 'alberto.beck@example.com', false, false);
INSERT INTO public."user" VALUES ('e1336c3c-3f60-4024-80e2-6e162f65bde5', 'uqagard', 'Ashley Gardner', 'ashley.gardner@example.com', false, false);
INSERT INTO public."user" VALUES ('05e296d3-4f51-4663-9b2f-d4524335e3fa', 'uqjsutt', 'Judith Sutton', 'judith.sutton@example.com', false, false);
INSERT INTO public."user" VALUES ('b9dc8b98-d4ba-4388-a061-bf72bf512b75', 'uqzmill', 'Zachary Mills', 'zachary.mills@example.com', false, false);
INSERT INTO public."user" VALUES ('06994f36-8141-460a-abd2-c38f24f80392', 'uqabail', 'Arnold Bailey', 'arnold.bailey@example.com', false, false);
INSERT INTO public."user" VALUES ('4df25b99-c739-4aaf-b269-15325691b317', 'uqjlewi', 'Jeremy Lewis', 'jeremy.lewis@example.com', false, false);
INSERT INTO public."user" VALUES ('8aac229e-9d99-44e7-8978-6ee6b6a8335f', 'uqmreyn', 'Marlene Reynolds', 'marlene.reynolds@example.com', false, false);
INSERT INTO public."user" VALUES ('12ae4e90-1f4d-4666-9715-b511980000eb', 'uqsfran', 'Stacy Franklin', 'stacy.franklin@example.com', false, false);
INSERT INTO public."user" VALUES ('af8c9a58-cb68-4c97-91fa-9cb98ad38973', 'uqllane', 'Letitia Lane', 'letitia.lane@example.com', false, false);
INSERT INTO public."user" VALUES ('ad7a04e8-35a7-4e4d-a1a9-89370d1dcb5e', 'uqcphil', 'Carlos Phillips', 'carlos.phillips@example.com', false, false);
INSERT INTO public."user" VALUES ('7c1e51b1-5071-43e4-82a5-ab360fd6d53b', 'uqjcrai12', 'Jeff Craig', 'jeff.craig@example.com', false, false);
INSERT INTO public."user" VALUES ('b4e38893-721d-4869-9176-db1b82ec751a', 'uqjharv', 'Jean Harvey', 'jean.harvey@example.com', false, false);
INSERT INTO public."user" VALUES ('ca36d2fb-3970-4cc3-a3af-accc819e64b3', 'uqmturn', 'Marsha Turner', 'marsha.turner@example.com', false, false);
INSERT INTO public."user" VALUES ('2a6649c7-6b0b-4083-b14b-643032702715', 'uqwhall', 'Walter Hall', 'walter.hall@example.com', false, false);
INSERT INTO public."user" VALUES ('4218aba0-476f-4a98-bbf9-f52de1324a1e', 'uqjalva', 'Juan Alvarez', 'juan.alvarez@example.com', false, false);
INSERT INTO public."user" VALUES ('0606710d-8557-4919-850b-34be9f7b9c1d', 'uqamay', 'Ashley May', 'ashley.may@example.com', false, false);
INSERT INTO public."user" VALUES ('a459fcca-7946-4ebd-976e-c9f0a7cee809', 'uqahawk', 'Alfredo Hawkins', 'alfredo.hawkins@example.com', false, false);
INSERT INTO public."user" VALUES ('67232b3a-8bbd-443a-86b2-898017f5de8e', 'uqmbarn', 'Maureen Barnes', 'maureen.barnes@example.com', false, false);
INSERT INTO public."user" VALUES ('04fc7fba-0b7b-4d4a-b96a-4ac09518401f', 'uqjholl', 'Jimmy Holland', 'jimmy.holland@example.com', false, false);
INSERT INTO public."user" VALUES ('cc5bcaa4-70cd-4273-ae11-640296283994', 'uqjmcco', 'Jeremiah Mccoy', 'jeremiah.mccoy@example.com', false, false);
INSERT INTO public."user" VALUES ('6c661692-ff37-4bd0-8b1a-6b17e404a804', 'uqnnels', 'Nora Nelson', 'nora.nelson@example.com', false, false);
INSERT INTO public."user" VALUES ('37192b2a-15ef-4ec1-85bc-1f96348dfb9d', 'uqjbrew', 'Justin Brewer', 'justin.brewer@example.com', false, false);
INSERT INTO public."user" VALUES ('45a50285-a1b1-4193-870a-0eca28d6a9ce', 'uqnshaw', 'Nelson Shaw', 'nelson.shaw@example.com', false, false);
INSERT INTO public."user" VALUES ('2ce0d230-28d9-41f5-80ea-585da1d9c9e6', 'uqasoto', 'Alfred Soto', 'alfred.soto@example.com', false, false);
INSERT INTO public."user" VALUES ('5a448180-38ee-40de-9f8d-57d1905c80be', 'uqgfraz', 'Gene Frazier', 'gene.frazier@example.com', false, false);
INSERT INTO public."user" VALUES ('b60b66e7-4fa1-4dac-9598-72bb42da5f41', 'uqkford', 'Kent Ford', 'kent.ford@example.com', false, false);
INSERT INTO public."user" VALUES ('fcd03ac4-7cae-46fe-b096-a53fd2585bbf', 'uqjpalm', 'Jenny Palmer', 'jenny.palmer@example.com', false, false);
INSERT INTO public."user" VALUES ('671eb5a7-aae7-438d-ba86-7e862149f9fe', 'uqnbrow', 'Nelson Brown', 'nelson.brown@example.com', false, false);


--
-- Data for Name: weekly_event; Type: TABLE DATA; Schema: public; Owner: queue
--

INSERT INTO public.weekly_event VALUES (0, 24, '9941444c-f092-4d88-a637-237714edc92b', 1, '31aad205-9022-4f00-93cd-4e1fcd15f565');
INSERT INTO public.weekly_event VALUES (0, 24, '9941444c-f092-4d88-a637-237714edc92b', 2, '1a4e06cd-99e1-4286-bda6-fd03b29822f5');
INSERT INTO public.weekly_event VALUES (0, 24, '9941444c-f092-4d88-a637-237714edc92b', 3, '7ff98b0f-4841-4c7b-81f5-99ad910fbf1e');
INSERT INTO public.weekly_event VALUES (0, 24, '9941444c-f092-4d88-a637-237714edc92b', 4, '210dc295-2ab9-46ad-af59-903e952499a1');
INSERT INTO public.weekly_event VALUES (0, 24, '0904cde0-0ec9-46c0-b674-b796c116c46a', 1, 'bdae3c06-efc5-4c44-abe5-2e6efa1e4d5d');
INSERT INTO public.weekly_event VALUES (0, 24, '0904cde0-0ec9-46c0-b674-b796c116c46a', 2, 'e3e7764c-98c7-4514-8cff-1d0ee428594b');
INSERT INTO public.weekly_event VALUES (0, 24, '0904cde0-0ec9-46c0-b674-b796c116c46a', 3, '8513d398-343f-427b-a94d-9f4b3be710ba');
INSERT INTO public.weekly_event VALUES (0, 24, '0904cde0-0ec9-46c0-b674-b796c116c46a', 4, '5b6ebf47-d965-4970-9b27-1ae9267c4071');
INSERT INTO public.weekly_event VALUES (0, 24, '0904cde0-0ec9-46c0-b674-b796c116c46a', 5, '955863bd-ae80-481b-9ba4-ffeb005c12b9');
INSERT INTO public.weekly_event VALUES (0, 24, '439750e4-996e-41b5-9515-c4601774dce5', 1, '59179f38-325f-41f5-a3a8-916e51bbfdba');
INSERT INTO public.weekly_event VALUES (0, 24, '439750e4-996e-41b5-9515-c4601774dce5', 2, '0df9bdf0-6130-4e19-a6a0-f836b01c2e2c');
INSERT INTO public.weekly_event VALUES (0, 24, '439750e4-996e-41b5-9515-c4601774dce5', 3, '0f8de905-4f52-4941-9590-cf3440286208');
INSERT INTO public.weekly_event VALUES (0, 24, '439750e4-996e-41b5-9515-c4601774dce5', 4, '891686fa-3b83-49cb-bc4c-84c8a78dbfe1');
INSERT INTO public.weekly_event VALUES (0, 24, '439750e4-996e-41b5-9515-c4601774dce5', 5, 'e529f60c-294e-49f3-bf5f-f3f6c989ac61');


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: queue
--

SELECT pg_catalog.setval('public.migrations_id_seq', 27, true);


--
-- Name: question PK_21e5786aa0ea704ae185a79b2d5; Type: CONSTRAINT; Schema: public; Owner: queue
--

ALTER TABLE ONLY public.question
    ADD CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY (id);


--
-- Name: course_user_meta PK_225bd37760daf7c2c284ba98484; Type: CONSTRAINT; Schema: public; Owner: queue
--

ALTER TABLE ONLY public.course_user_meta
    ADD CONSTRAINT "PK_225bd37760daf7c2c284ba98484" PRIMARY KEY (id);


--
-- Name: queue PK_4adefbd9c73b3f9a49985a5529f; Type: CONSTRAINT; Schema: public; Owner: queue
--

ALTER TABLE ONLY public.queue
    ADD CONSTRAINT "PK_4adefbd9c73b3f9a49985a5529f" PRIMARY KEY (id);


--
-- Name: course_staff PK_6bc9388e2bf79cf6de4678dc81b; Type: CONSTRAINT; Schema: public; Owner: queue
--

ALTER TABLE ONLY public.course_staff
    ADD CONSTRAINT "PK_6bc9388e2bf79cf6de4678dc81b" PRIMARY KEY (id);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: queue
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: weekly_event PK_8d1a1a9292c5bfec77c21270e67; Type: CONSTRAINT; Schema: public; Owner: queue
--

ALTER TABLE ONLY public.weekly_event
    ADD CONSTRAINT "PK_8d1a1a9292c5bfec77c21270e67" PRIMARY KEY (id);


--
-- Name: course PK_bf95180dd756fd204fb01ce4916; Type: CONSTRAINT; Schema: public; Owner: queue
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT "PK_bf95180dd756fd204fb01ce4916" PRIMARY KEY (id);


--
-- Name: room PK_c6d46db005d623e691b2fbcba23; Type: CONSTRAINT; Schema: public; Owner: queue
--

ALTER TABLE ONLY public.room
    ADD CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: queue
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: course_staff UQ_50a755fd485b8353f7c293ec5d4; Type: CONSTRAINT; Schema: public; Owner: queue
--

ALTER TABLE ONLY public.course_staff
    ADD CONSTRAINT "UQ_50a755fd485b8353f7c293ec5d4" UNIQUE ("userId", "courseId");


--
-- Name: course UQ_5cf4963ae12285cda6432d5a3a4; Type: CONSTRAINT; Schema: public; Owner: queue
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT "UQ_5cf4963ae12285cda6432d5a3a4" UNIQUE (code);


--
-- Name: user UQ_78a916df40e02a9deb1c4b75edb; Type: CONSTRAINT; Schema: public; Owner: queue
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE (username);


--
-- Name: course UQ_8a167196d86062fa6abf6f0d546; Type: CONSTRAINT; Schema: public; Owner: queue
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT "UQ_8a167196d86062fa6abf6f0d546" UNIQUE (alias);


--
-- Name: course_user_meta UQ_efc6e6ce1d0a41624e195edf963; Type: CONSTRAINT; Schema: public; Owner: queue
--

ALTER TABLE ONLY public.course_user_meta
    ADD CONSTRAINT "UQ_efc6e6ce1d0a41624e195edf963" UNIQUE ("userId", "courseId");


--
-- Name: question FK_11181c24384d8054e878ae766dc; Type: FK CONSTRAINT; Schema: public; Owner: queue
--

ALTER TABLE ONLY public.question
    ADD CONSTRAINT "FK_11181c24384d8054e878ae766dc" FOREIGN KEY ("opId") REFERENCES public."user"(id);


--
-- Name: room FK_1cd9109e475c5a95bba8612a9d9; Type: FK CONSTRAINT; Schema: public; Owner: queue
--

ALTER TABLE ONLY public.room
    ADD CONSTRAINT "FK_1cd9109e475c5a95bba8612a9d9" FOREIGN KEY ("courseId") REFERENCES public.course(id) ON DELETE CASCADE;


--
-- Name: course_staff FK_2e099fcbb0ffe5108a4df4b31c8; Type: FK CONSTRAINT; Schema: public; Owner: queue
--

ALTER TABLE ONLY public.course_staff
    ADD CONSTRAINT "FK_2e099fcbb0ffe5108a4df4b31c8" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: course_user_meta FK_3abb26ab7f62567c12d71c32a9b; Type: FK CONSTRAINT; Schema: public; Owner: queue
--

ALTER TABLE ONLY public.course_user_meta
    ADD CONSTRAINT "FK_3abb26ab7f62567c12d71c32a9b" FOREIGN KEY ("courseId") REFERENCES public.course(id);


--
-- Name: weekly_event FK_5c3ad51d0475eb3dab721d0b9d7; Type: FK CONSTRAINT; Schema: public; Owner: queue
--

ALTER TABLE ONLY public.weekly_event
    ADD CONSTRAINT "FK_5c3ad51d0475eb3dab721d0b9d7" FOREIGN KEY ("roomId") REFERENCES public.room(id) ON DELETE CASCADE;


--
-- Name: question FK_6381748e499c8913003dc2adaa9; Type: FK CONSTRAINT; Schema: public; Owner: queue
--

ALTER TABLE ONLY public.question
    ADD CONSTRAINT "FK_6381748e499c8913003dc2adaa9" FOREIGN KEY ("claimerId") REFERENCES public."user"(id);


--
-- Name: course_user_meta FK_730dbd0489dfe2c9c46f23b3375; Type: FK CONSTRAINT; Schema: public; Owner: queue
--

ALTER TABLE ONLY public.course_user_meta
    ADD CONSTRAINT "FK_730dbd0489dfe2c9c46f23b3375" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: course_staff FK_7e0675201d7cc340eccbca792f7; Type: FK CONSTRAINT; Schema: public; Owner: queue
--

ALTER TABLE ONLY public.course_staff
    ADD CONSTRAINT "FK_7e0675201d7cc340eccbca792f7" FOREIGN KEY ("courseId") REFERENCES public.course(id);


--
-- Name: question FK_83f26a5124fd7d091efeea8a8ac; Type: FK CONSTRAINT; Schema: public; Owner: queue
--

ALTER TABLE ONLY public.question
    ADD CONSTRAINT "FK_83f26a5124fd7d091efeea8a8ac" FOREIGN KEY ("queueId") REFERENCES public.queue(id) ON DELETE CASCADE;


--
-- Name: queue FK_a8b42ff43a9ac840bc2cb441ec7; Type: FK CONSTRAINT; Schema: public; Owner: queue
--

ALTER TABLE ONLY public.queue
    ADD CONSTRAINT "FK_a8b42ff43a9ac840bc2cb441ec7" FOREIGN KEY ("roomId") REFERENCES public.room(id);


--
-- PostgreSQL database dump complete
--

