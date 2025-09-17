import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCvDto {
  @ApiProperty({
    example: 'Full Stack Developer',
    description: 'Title or position of the CV',
  })
  @IsNotEmpty()
  @IsString()
  title: string

  @ApiProperty({
    example: 'https://example.com/photo.jpg',
    description: 'Profile photo URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  photoUrl?: string

  @ApiProperty({
    example: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+123456789',
      address: '123 Street, City, Country',
    },
    description: 'Personal information of the candidate',
    required: false,
  })
  @IsOptional()
  personal?: Record<string, any>

  @ApiProperty({
    example: [
      {
        degree: 'BS Computer Science',
        institution: 'ABC University',
        startYear: 2018,
        endYear: 2022,
      },
    ],
    description: 'Educational background',
    required: false,
  })
  @IsOptional()
  @IsArray()
  education?: Record<string, any>[]

  @ApiProperty({
    example: [
      {
        company: 'TechCorp',
        position: 'Software Engineer',
        startDate: '2022-06-01',
        endDate: '2024-01-01',
        description: 'Worked on backend APIs and microservices.',
      },
    ],
    description: 'Work experience',
    required: false,
  })
  @IsOptional()
  @IsArray()
  experience?: Record<string, any>[]

  @ApiProperty({
    example: ['JavaScript', 'NestJS', 'MongoDB', 'React'],
    description: 'List of skills',
    required: false,
  })
  @IsOptional()
  @IsArray()
  skills?: string[]

  // 🆕 Additional fields

  @ApiProperty({
    example: 'Passionate developer with 3 years of experience in MERN stack.',
    description: 'Short professional summary',
    required: false,
  })
  @IsOptional()
  @IsString()
  summary?: string

  @ApiProperty({
    example: ['English', 'Urdu', 'Spanish'],
    description: 'Languages the candidate can speak',
    required: false,
  })
  @IsOptional()
  @IsArray()
  languages?: string[]

  @ApiProperty({
    example: ['Best Developer 2024', 'Hackathon Winner'],
    description: 'Awards achieved by the candidate',
    required: false,
  })
  @IsOptional()
  @IsArray()
  awards?: string[]

  @ApiProperty({
    example: ['AWS Certified Developer', 'Google UX Design Certificate'],
    description: 'Certificates of the candidate',
    required: false,
  })
  @IsOptional()
  @IsArray()
  certificates?: string[]

  @ApiProperty({
    example: ['Reading', 'Open Source', 'Traveling'],
    description: 'Personal interests or hobbies',
    required: false,
  })
  @IsOptional()
  @IsArray()
  interests?: string[]

  @ApiProperty({
    example: [
      {
        name: 'Portfolio Website',
        description: 'Built a personal portfolio using Next.js and TailwindCSS',
        link: 'https://myportfolio.com',
      },
    ],
    description: 'Notable projects done by the candidate',
    required: false,
  })
  @IsOptional()
  @IsArray()
  projects?: Record<string, any>[]

  @ApiProperty({
    example: [
      {
        title: 'AI in Education',
        publisher: 'Tech Journal',
        date: '2024-05-12',
      },
    ],
    description: 'Publications authored by the candidate',
    required: false,
  })
  @IsOptional()
  @IsArray()
  publications?: Record<string, any>[]

  @ApiProperty({
    example: [
      {
        organization: 'Local NGO',
        role: 'Web Developer Volunteer',
        startDate: '2023-01-01',
        endDate: '2023-06-01',
      },
    ],
    description: 'Volunteering experiences of the candidate',
    required: false,
  })
  @IsOptional()
  @IsArray()
  volunteering?: Record<string, any>[]
}
