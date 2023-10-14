import rivetQuery from '@hashicorp/platform-cms'
import { GetStaticPropsResult } from 'next'
import { PersonRecord, DepartmentRecord } from 'types'
import BaseLayout from '../../layouts/base'
import style from './style.module.css'
import query from './query.graphql'
import React, { useState } from 'react'

interface Props {
	allPeople: PersonRecord[]
	allDepartments: DepartmentRecord[]
}

const PersonCard: React.FC<PersonRecord> = ({ name, avatar, department }) => (
	<div className={style.personCard}>
		{avatar && avatar.url && (
			<img src={avatar.url} alt={name} className={style.personImage} />
		)}
		<h3>{name}</h3>
		{department && <p>{department.name}</p>}
	</div>
)

export default function PeoplePage({
	allPeople,
	allDepartments,
}: Props): React.ReactElement {
	const [searchTerm, setSearchTerm] = useState('')
	const [hideWithoutImage, setHideWithoutImage] = useState(false)
	const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
		null
	)

	const filteredPeople = allPeople.filter(
		(person) =>
			person.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
			(!hideWithoutImage || (person.avatar && person.avatar.url)) &&
			(!selectedDepartment ||
				(person.department && person.department.name === selectedDepartment))
	)

	return (
		<div>
			<div className={style['header-container']}>
				<div className={style.header}>HashiCorp Humans</div>
				<input
					type="text"
					placeholder="Search people by name"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className={style['search-input']}
				/>
				<div className={style['checkbox-container']}>
					<input
						type="checkbox"
						checked={hideWithoutImage}
						onChange={() => setHideWithoutImage(!hideWithoutImage)}
					/>
					<label>Hide people missing a profile image</label>
				</div>
			</div>
			<div className={style.container}>
				<aside className={style.sidebar}>
					<h2>Filter By Department</h2>
					{allDepartments.map((dept) => (
						<div
							key={dept.id}
							className={style.departmentItem}
							onClick={() => setSelectedDepartment(dept.name)}
						>
							{dept.name}
						</div>
					))}
				</aside>
				<main className={style.peopleList}>
					{filteredPeople.map((person) => (
						<PersonCard key={person.name} {...person} />
					))}
				</main>
			</div>
		</div>
	)
}

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
	const data = await rivetQuery({ query })
	return { props: data }
}

PeoplePage.layout = BaseLayout
